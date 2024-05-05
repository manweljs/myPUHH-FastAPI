from fastapi_crudrouter.core.tortoise import TortoiseCRUDRouter
from .models import LHC, Barcode
from fastapi import APIRouter, status, Depends, HTTPException
from typing import List
from utils.tokens import get_current_user, User, get_perusahaan
from . import schemas
from umum.schemas import Response
from account.schemas import PerusahaanSchema as Perusahaan
from uuid import UUID
from .functions import get_upload_barcodes_from_file
import time
from tortoise.transactions import in_transaction

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
async def get_all_barcode(perusahaan: Perusahaan = Depends(get_perusahaan)):
    start_time = time.time()

    barcode = await Barcode.filter(perusahaan=perusahaan)
    end_time = time.time()  # Waktu selesai proses
    duration = end_time - start_time  # Durasi proses
    print(f"Duration to process : {duration:.2f} seconds.")
    return barcode
