from .serializers import LHCSerializer
from .models import LHC, Barcode, RencanaTebang, Pohon
from fastapi import APIRouter, status, Depends, HTTPException
from typing import List, Union
from utils.tokens import get_perusahaan
from . import schemas
from umum.schemas import ErrorResponse, ResponseSchema as Response
from account.schemas import PerusahaanSchema as Perusahaan
from uuid import UUID
from .functions import (
    get_upload_barcodes_from_file,
    get_upload_pohon_from_file,
    save_lhc_barcode_to_db,
    save_lhc_pohon_to_db,
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


BATCH_SIZE = 1000

router = APIRouter(tags=["Cruising"], prefix="/api/Cruising")


@router.post("/LHC", response_model=schemas.LHCSchema)
async def create_lhc(
    lhc: schemas.LHCInSchema, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    data = lhc.model_dump()
    data["perusahaan_id"] = perusahaan
    try:
        lhc_created = await LHC.create(**data)
        await lhc_created.fetch_related("tahun")
        return lhc_created
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/LHC/GetAll", response_model=List[schemas.LHCBaseSchema])
@timing_decorator
async def get_all_lhc(perusahaan: Perusahaan = Depends(get_perusahaan)):
    lhc_query = (
        await LHC.filter(perusahaan=perusahaan)
        .prefetch_related("tahun")
        .annotate(total_pohon=Count("pohons", 0), total_volume=Sum("pohons__volume", 0))
        .order_by("id")
        .all()
    )

    serializer = LHCSerializer(lhc_query, many=True)
    return await serializer.serialize()


@router.get("/LHC/{id}", response_model=schemas.LHCBaseSchema)
@timing_decorator
async def get_lhc(id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)):
    lhc_query = (
        await LHC.filter(id=id, perusahaan=perusahaan)
        .prefetch_related("tahun")
        .annotate(total_pohon=Count("pohons", 0), total_volume=Sum("pohons__volume", 0))
        .order_by("id")
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
        await LHC(**data.model_dump()).validate_unique(id)

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
        return rencana_tebang_created
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/RencanaTebang/GetAll", response_model=List[schemas.RencanaTebangSchema])
async def get_all_rencana_tebang(perusahaan: Perusahaan = Depends(get_perusahaan)):
    rencana_tebang = await RencanaTebang.filter(perusahaan=perusahaan).prefetch_related(
        "tahun"
    )
    return rencana_tebang


@router.get("/RencanaTebang/{id}", response_model=schemas.RencanaTebangSchema)
async def get_rencana_tebang(
    id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    rencana_tebang = await RencanaTebang.get_or_none(
        id=id, perusahaan=perusahaan
    ).prefetch_related("tahun")

    if not rencana_tebang:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rencana Tebang not found"
        )
    return rencana_tebang


@router.put("/RencanaTebang/{id}", response_model=Response)
async def update_rencana_tebang(
    id: UUID,
    data: schemas.RencanaTebangInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    updated_count = await RencanaTebang.filter(id=id, perusahaan=perusahaan).update(
        **data.model_dump(exclude_unset=True)
    )
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="Rencana Tebang not found")
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
        .order_by("nomor")
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
