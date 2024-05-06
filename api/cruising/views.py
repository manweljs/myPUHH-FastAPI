from tracemalloc import start
from fastapi_crudrouter.core.tortoise import TortoiseCRUDRouter
from .models import LHC, Barcode, RencanaTebang, Pohon
from fastapi import APIRouter, status, Depends, HTTPException
from typing import List
from utils.tokens import get_current_user, User, get_perusahaan
from . import schemas
from umum.schemas import Response
from account.schemas import PerusahaanSchema as Perusahaan
from uuid import UUID
from .functions import get_upload_barcodes_from_file, get_upload_pohon_from_file
import time
from tortoise.transactions import in_transaction
from utils.decorators import timing_decorator

router = APIRouter(tags=["Cruising"], prefix="/api/Cruising")


@router.post("/LHC", response_model=schemas.LHC)
async def create_lhc(
    lhc: schemas.LHCIn, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    data = lhc.model_dump()
    data["perusahaan_id"] = perusahaan
    try:
        lhc_created = await LHC.create(**data)
        await lhc_created.fetch_related("tahun")
        return lhc_created
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/LHC/GetAll", response_model=List[schemas.LHCPydantic])
async def get_all_lhc(perusahaan: Perusahaan = Depends(get_perusahaan)):
    lhc = await LHC.filter(perusahaan=perusahaan).prefetch_related("tahun", "barcode")
    return lhc


@router.get("/LHC/{id}", response_model=schemas.LHC)
async def get_lhc(id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)):
    start_time = time.time()
    lhc = await LHC.get_or_none(id=id, perusahaan=perusahaan).prefetch_related(
        "tahun", "barcode"
    )
    if not lhc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="LHC not found"
        )
    end_time = time.time()  # Waktu selesai proses
    duration = end_time - start_time  # Durasi proses
    print(f"Duration to process : {duration:.2f} seconds.")
    return lhc


@router.put("/LHC/{id}", response_model=Response)
async def update_lhc(
    id: UUID, data: schemas.LHCIn, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    updated_count = await LHC.filter(id=id, perusahaan=perusahaan).update(
        **data.model_dump(exclude_unset=True)
    )
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="Blok not found")
    return Response(message="Data berhasil diupdate")


@router.delete("/LHC/{id}", response_model=Response)
async def delete_lhc(id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)):
    lhc = await LHC.get_or_none(id=id, perusahaan=perusahaan)
    if not lhc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="LHC not found"
        )
    await lhc.delete()
    return Response(message="LHC deleted")


@router.post(
    "/UploadBarcode",
    response_model=Response,
    tags=["Cruising", "Upload"],
    description="""Endpoint untuk upload barcode, 
    file yang diupload harus berupa file csv yang berisi list barcode, 
    dan request yg dikirimkan menyertakan url file csv yang diupload""",
)
async def upload_barcode(
    data: schemas.UploadBarcodeIn, perusahaan: Perusahaan = Depends(get_perusahaan)
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


@router.get("/Barcode/GetAll", response_model=List[schemas.Barcode])
@timing_decorator
async def get_all_barcode(perusahaan: Perusahaan = Depends(get_perusahaan)):
    barcode = await Barcode.filter(perusahaan=perusahaan)
    return barcode


# CRUD Rencana Tebang
@router.post("/RencanaTebang", response_model=schemas.RencanaTebang)
async def create_rencana_tebang(
    rencana_tebang: schemas.RencanaTebangIn,
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


@router.get("/RencanaTebang/GetAll", response_model=List[schemas.RencanaTebang])
async def get_all_rencana_tebang(perusahaan: Perusahaan = Depends(get_perusahaan)):
    rencana_tebang = await RencanaTebang.filter(perusahaan=perusahaan).prefetch_related(
        "tahun"
    )
    return rencana_tebang


@router.get("/RencanaTebang/{id}", response_model=schemas.RencanaTebang)
async def get_rencana_tebang(
    id: UUID, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    rencana_tebang = await RencanaTebang.get_or_none(id=id, perusahaan=perusahaan)
    if not rencana_tebang:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rencana Tebang not found"
        )
    return rencana_tebang


@router.put("/RencanaTebang/{id}", response_model=Response)
async def update_rencana_tebang(
    id: UUID,
    data: schemas.RencanaTebangIn,
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
    response_model=schemas.Pohon,
    tags=["Cruising", "Upload"],
    description="""Endpoint untuk menambahkan data pohon,
    file yang diupload harus berupa file csv yang berisi list pohon,
    dan request yg dikirimkan menyertakan url file csv yang diupload.
    - template file : https://mypuhh.s3.ap-southeast-1.amazonaws.com/uploads/template_upload_pohon.csv
    """,
)
async def upload_pohon(
    data: schemas.UploadPohonIn, perusahaan: Perusahaan = Depends(get_perusahaan)
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


# get all pohon
@router.get("/Pohon/GetAll", response_model=List[schemas.Pohon])
async def get_all_pohon(perusahaan: Perusahaan = Depends(get_perusahaan)):
    pohon = await Pohon.filter(perusahaan=perusahaan)
    return pohon


# get pohon by id
@router.get("/Pohon/{id}", response_model=schemas.Pohon)
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
    id: UUID, data: schemas.PohonIn, perusahaan: Perusahaan = Depends(get_perusahaan)
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
