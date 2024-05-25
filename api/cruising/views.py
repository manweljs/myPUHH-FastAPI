from parameter.models import Blok
from umum.models import Jenis
from .serializers import LHCSerializer, RencanaTebangSerializer
from .models import LHC, Barcode, RencanaTebang, Pohon
from fastapi import APIRouter, status, Depends, HTTPException
from typing import List, Union
from utils.tokens import get_perusahaan
from . import schemas
from umum.schemas import ErrorResponse, ResponseSchema as Response
from account.schemas import PerusahaanSchema as Perusahaan
from uuid import UUID
from .functions import (
    get_rekapitulasi_lhc,
    get_upload_barcodes_from_file,
    get_upload_pohon_from_file,
    save_barcode_rencana_tebang_to_db,
    save_lhc_barcode_to_db,
    save_lhc_pohon_to_db,
    set_target_pohon_rencana_tebang,
)
import time
from tortoise.transactions import in_transaction
from utils.decorators import timing_decorator
from tortoise.exceptions import IntegrityError
from fastapi_pagination import Page, Params
from fastapi_pagination.ext.tortoise import paginate
import asyncio
from utils.pagination import CustomPage
from tortoise.expressions import Q
from tortoise.functions import Sum, Count
from collections import defaultdict


BATCH_SIZE = 1000

router = APIRouter(tags=["Cruising"], prefix="/api/Cruising")


@router.post("/LHC", response_model=schemas.LHCBaseSchema)
async def create_lhc(
    lhc: schemas.LHCInSchema, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    data = lhc.model_dump(exclude_unset=True, exclude_none=True)
    data["perusahaan_id"] = perusahaan
    try:
        lhc_created = await LHC.create(**data)
        await lhc_created.fetch_related("tahun")
        serializer = LHCSerializer(lhc_created)
        return await serializer.serialize()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/LHC/GetAll", response_model=List[schemas.LHCBaseSchema])
@timing_decorator
async def get_all_lhc(perusahaan: Perusahaan = Depends(get_perusahaan)):
    lhc_query = (
        await LHC.filter(perusahaan=perusahaan)
        .prefetch_related("tahun", "blok")
        .annotate(total_pohon=Count("pohons", 0), total_volume=Sum("pohons__volume", 0))
        .order_by("tanggal")
        .all()
    )

    serializer = LHCSerializer(lhc_query, many=True)
    return await serializer.serialize()


@router.get("/LHC/{id}", response_model=schemas.LHCBaseSchema)
@timing_decorator
async def get_lhc(id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)):
    lhc_query = (
        await LHC.filter(id=id, perusahaan=perusahaan)
        .prefetch_related("tahun", "blok")
        .annotate(total_pohon=Count("pohons", 0), total_volume=Sum("pohons__volume", 0))
        .first()
    )

    serializer = LHCSerializer(lhc_query)
    return await serializer.serialize()


@router.put("/LHC/{id}", response_model=Response)
async def update_lhc(
    id: UUID,
    data: schemas.LHCInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    try:
        await LHC(
            **data.model_dump(exclude_none=True, exclude_unset=True)
        ).validate_unique(id)

        updated_count = await LHC.filter(id=id, perusahaan=perusahaan).update(
            **data.model_dump(exclude_unset=True)
        )
        if updated_count == 0:
            raise HTTPException(status_code=404, detail="Blok not found")
        return Response(message="Data berhasil diupdate")
    except IntegrityError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.delete("/LHC/{id}", response_model=Response)
async def delete_lhc(id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)):
    lhc = await LHC.get_or_none(id=id, perusahaan=perusahaan)
    if not lhc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="LHC not found"
        )
    await lhc.delete()
    return Response(message="LHC deleted")


@router.get(
    "/LHC/{lhc_id}/GetBarcode/All",
    response_model=List[
        schemas.BarcodeSchema
    ],  # Mengembalikan halaman yang berisi string barcode
    description="Get all barcode list by LHC ID",
)
@timing_decorator
async def get_all_barcode_list_by_lhc_id(
    lhc_id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    barcodes = await Barcode.filter(lhc_id=lhc_id, perusahaan=perusahaan).order_by(
        "barcode"
    )
    return barcodes


@router.get(
    "/LHC/{lhc_id}/GetBarcode",
    response_model=CustomPage[str],  # Mengembalikan halaman yang berisi string barcode
    description="Get barcode list by LHC ID",
)
@timing_decorator
async def get_barcode_list_by_lhc_id(
    lhc_id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    # Memulai query dengan model Barcode
    barcode_query = Barcode.filter(lhc_id=lhc_id, perusahaan=perusahaan)

    async def transform(item):
        return item.barcode

    async def transform_all(items):
        return await asyncio.gather(*(transform(item) for item in items))

    barcodes_page = await paginate(barcode_query, transformer=transform_all)
    return barcodes_page


@router.post(
    "/UploadBarcode",
    response_model=Response,
    tags=["Cruising", "Upload"],
    description="""Endpoint untuk upload barcode, 
    file yang diupload harus berupa file csv yang berisi list barcode, 
    dan request yg dikirimkan menyertakan url file csv yang diupload""",
)
async def upload_barcode(
    data: schemas.UploadBarcodeInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    start_time = time.time()
    data = data.model_dump()
    try:
        barcodes = await get_upload_barcodes_from_file(data["file_url"])

        # Membuat instance Barcode dalam jumlah besar
        barcode_instances = [
            Barcode(barcode=barcode, perusahaan_id=perusahaan, lhc_id=data["lhc_id"])
            for barcode in barcodes
        ]

        # Melakukan bulk insert
        async with in_transaction():
            await Barcode.bulk_create(barcode_instances)

        end_time = time.time()  # Waktu selesai proses
        duration = end_time - start_time  # Durasi proses
        print(f"Duration to process {len(barcodes)} barcodes: {duration:.2f} seconds.")
        return Response(message="Barcode berhasil diupload")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/Barcode/GetAll", response_model=List[schemas.BarcodeSchema])
@timing_decorator
async def get_all_barcode(perusahaan: Perusahaan = Depends(get_perusahaan)):
    barcode = await Barcode.filter(perusahaan=perusahaan)
    return barcode


# CRUD Rencana Tebang
@router.post("/RencanaTebang", response_model=schemas.RencanaTebangSchema)
async def create_rencana_tebang(
    rencana_tebang: schemas.RencanaTebangInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    data = rencana_tebang.model_dump()
    data["perusahaan_id"] = perusahaan
    try:
        rencana_tebang_created = await RencanaTebang.create(**data)
        await rencana_tebang_created.fetch_related("tahun")
        serializer = RencanaTebangSerializer(rencana_tebang_created)
        return await serializer.serialize()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/RencanaTebang/GetAll", response_model=List[schemas.RencanaTebangSchema])
@timing_decorator
async def get_all_rencana_tebang(perusahaan: Perusahaan = Depends(get_perusahaan)):
    rencana_tebang = await RencanaTebang.filter(perusahaan=perusahaan).prefetch_related(
        "tahun",
        "jenis",
        "blok",
    )
    serializer = RencanaTebangSerializer(rencana_tebang, many=True)
    return await serializer.serialize()


@router.get("/RencanaTebang/{id}", response_model=schemas.RencanaTebangSchema)
@timing_decorator
async def get_rencana_tebang(
    id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    rencana_tebang = await RencanaTebang.get_or_none(
        id=id, perusahaan=perusahaan
    ).prefetch_related("tahun", "jenis", "blok")

    if not rencana_tebang:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rencana Tebang not found"
        )

    serializer = RencanaTebangSerializer(rencana_tebang)
    return await serializer.serialize()


@router.put("/RencanaTebang/{id}", response_model=Response)
async def update_rencana_tebang(
    id: UUID,
    data: schemas.RencanaTebangInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    # log data
    print(data)
    blok_ids = data.blok_ids  # Ini bisa None atau list kosong

    jenis_ids = data.jenis_ids  # Ini bisa None atau list kosong
    rencana_tebang = await RencanaTebang.get_or_none(id=id, perusahaan=perusahaan)
    if not rencana_tebang:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rencana Tebang not found"
        )

    # Update atribut lainnya
    await rencana_tebang.update_from_dict(data.model_dump(exclude={"jenis"}))
    await rencana_tebang.save()

    # Cek apakah blok_ids ada dan tidak kosong
    if blok_ids:
        blok_instances = await Blok.filter(id__in=blok_ids).all()
        if not blok_instances:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Blok not found"
            )
        # Clear dan add relasi ManyToMany
        await rencana_tebang.blok.clear()
        await rencana_tebang.blok.add(*blok_instances)

    # Cek apakah jenis_ids ada dan tidak kosong
    if jenis_ids:
        jenis_instances = await Jenis.filter(id__in=jenis_ids).all()
        if not jenis_instances:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Jenis not found"
            )
        # Clear dan add relasi ManyToMany
        await rencana_tebang.jenis.clear()
        await rencana_tebang.jenis.add(*jenis_instances)
    else:
        # Jika list kosong atau None, hanya clear relasi yang ada
        await rencana_tebang.jenis.clear()
    return Response(message="Data berhasil diupdate")


@router.delete("/RencanaTebang/{id}", response_model=Response)
async def delete_rencana_tebang(
    id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    rencana_tebang = await RencanaTebang.get_or_none(id=id, perusahaan=perusahaan)
    if not rencana_tebang:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rencana Tebang not found"
        )
    await rencana_tebang.delete()
    return Response(message="Rencana Tebang deleted")


# CRUD Pohon
@router.post(
    "/UploadPohon",
    response_model=schemas.PohonSchema,
    tags=["Cruising", "Upload"],
    description="## Endpoint untuk menambahkan data pohon\n\nfile yang diupload harus berupa file csv yang berisi list pohon, dan request yg dikirimkan menyertakan _file url_ .csv yang diupload.\n\n**template file** : [Download](https://mypuhh.s3.ap-southeast-1.amazonaws.com/uploads/template_upload_pohon.csv)",
)
async def upload_pohon(
    data: schemas.UploadPohonInSchema, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    start_time = time.time()
    data = data.model_dump()
    try:
        pohon_list = await get_upload_pohon_from_file(data["file_url"])
        pohon_instances = [
            Pohon(perusahaan_id=perusahaan, **pohon) for pohon in pohon_list
        ]

        # Melakukan bulk insert
        async with in_transaction():
            await Pohon.bulk_create(pohon_instances)

        end_time = time.time()  # Waktu selesai proses
        duration = end_time - start_time  # Durasi proses
        print(f"Duration to process {len(pohon_list)} pohon: {duration:.2f} seconds.")
        return Response(message="Data pohon berhasil diupload")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# get pohon by id
@router.get("/Pohon/{id}", response_model=schemas.PohonSchema)
async def get_pohon(id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)):
    pohon = await Pohon.get_or_none(id=id, perusahaan=perusahaan)
    if not pohon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pohon not found"
        )
    return pohon


# update pohon
@router.put("/Pohon/{id}", response_model=Response)
async def update_pohon(
    id: UUID,
    data: schemas.PohonInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    updated_count = await Pohon.filter(id=id, perusahaan=perusahaan).update(
        **data.model_dump(exclude_unset=True)
    )
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="Pohon not found")
    return Response(message="Data berhasil diupdate")


# delete pohon
@router.delete("/Pohon/{id}", response_model=Response)
async def delete_pohon(id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)):
    pohon = await Pohon.get_or_none(id=id, perusahaan=perusahaan)
    if not pohon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pohon not found"
        )
    await pohon.delete()
    return Response(message="Pohon deleted")


@router.put(
    "/LHC/{lhc_id}/SaveBarcode",
    response_model=Union[Response, ErrorResponse],
)
async def save_lhc_barcode(
    lhc_id: UUID,
    data: schemas.SaveLHCBarcodeSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    try:
        lhc = await LHC.get_or_none(id=lhc_id, perusahaan=perusahaan)
        errors = await save_lhc_barcode_to_db(data.barcodes, perusahaan, lhc_id)
        if errors:
            return ErrorResponse(errors=errors)
        return Response(message="Barcode berhasil disimpan")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# get all pohon by LHC ID
@router.get(
    "/LHC/{lhc_id}/Pohon/GetAll",
    response_model=List[schemas.PohonSchema],
    description="## Get all pohon by LHC ID",
)
async def get_all_pohon(lhc_id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)):
    pohon = (
        await Pohon.filter(Q(lhc=lhc_id) & Q(perusahaan=perusahaan))
        .order_by(
            "petak__nama",
            "nomor",
        )
        .prefetch_related(
            "jenis",
            "kelas_diameter",
            "sortimen",
            "status_pohon",
            "petak",
            "barcode",
            "jenis__kelompok_jenis",
        )
    )
    return pohon


@router.put(
    "/LHC/{lhc_id}/Pohon/Save",
    response_model=Union[Response, ErrorResponse],
)
@timing_decorator
async def save_pohon(
    lhc_id: UUID,
    data: List[schemas.PohonInSchema],
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    try:
        print("Start saving pohon")
        lhc = await LHC.get_or_none(id=lhc_id, perusahaan=perusahaan)
        if not lhc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="LHC not found"
            )

        errors = await save_lhc_pohon_to_db(data, lhc_id, perusahaan)
        if errors:
            return ErrorResponse(errors=errors)
        return Response(message="Pohon berhasil disimpan")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get(
    "/LHC/{lhc_id}/Rekapitulasi",
    description="Get LHC rekapitulasi by LHC ID",
)
@timing_decorator
async def get_rekap_lhc(
    lhc_id: UUID,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    try:
        data = await get_rekapitulasi_lhc(lhc_id, perusahaan)
        if data:
            return data
        else:
            raise HTTPException(status_code=404, detail="Data not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put(
    "/RencanaTebang/{rencana_tebang_id}/Barcode/Save",
    response_model=Response,
    description="""## Save barcode rencana tebang\n pada setiap request, semua barcode yg terdaftar untuk rencana tebang akan dihapus dan digantikan data baru yang masuk""",
)
@timing_decorator
async def save_rencana_tebang_barcode(
    rencana_tebang_id: UUID,
    data: schemas.SaveBarcodeRencanaTebangSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    try:
        # check if rencana tebang exists
        rencana_tebang = await RencanaTebang.get_or_none(
            id=rencana_tebang_id, perusahaan=perusahaan
        )
        if not rencana_tebang:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Rencana Tebang not found"
            )

        errors = await save_barcode_rencana_tebang_to_db(
            rencana_tebang_id, data.barcodes
        )
        if errors:
            return ErrorResponse(errors=errors)
        return Response(message="Barcode berhasil disimpan")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# get barcode by rencana tebang id
@router.get(
    "/RencanaTebang/{rencana_tebang_id}/Barcode/GetAll",
    response_model=List[schemas.BarcodeSchema],
    description="## Get all barcode by rencana tebang ID",
)
@timing_decorator
async def get_all_barcode_by_rencana_tebang_id(
    rencana_tebang_id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    barcode = await Barcode.filter(
        Q(rencana_tebang=rencana_tebang_id) & Q(perusahaan=perusahaan)
    ).order_by("barcode")
    return barcode


description = """
ChimichangApp API helps you do awesome stuff. 🚀

## Items

You can **read items**.

## Users

You will be able to:

* **Create users** (_not implemented_).
* **Read users** (_not implemented_).
"""


@router.put(
    "/RencanaTebang/{rencana_tebang_id}/SetTarget",
    response_model=Response,
    description="""
## Set target pohon pada rencana tebang\n
Rencana tebang harus sudah memiliki data jenis target jika obyeknya adalah **Blok/Petak**.\n
Jika obyeknya **Jalan**, maka semua pohon di LHC jalan pada tahun kegiatan yg sama
dengan Rencana Tebang akan dijadikan target pohon.
""",
)
@timing_decorator
async def set_target_pohon(
    rencana_tebang_id: UUID,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    try:
        rencana_tebang = await RencanaTebang.get_or_none(
            id=rencana_tebang_id, perusahaan=perusahaan
        ).prefetch_related("blok")
        if not rencana_tebang:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Rencana Tebang not found"
            )

        errors = await set_target_pohon_rencana_tebang(rencana_tebang, perusahaan)
        print(errors)
        return Response(message="Target pohon berhasil diupdate")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
