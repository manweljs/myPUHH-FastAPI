# view untuk angkutan

from .models import DKBAngkutan, DKBBarcode
from fastapi import APIRouter, status, Depends, HTTPException
from typing import List
from utils.tokens import get_perusahaan
from . import schemas
from umum.schemas import Response
from account.schemas import PerusahaanSchema as Perusahaan
from uuid import UUID
from tortoise.transactions import in_transaction

router = APIRouter(tags=["Angkutan"], prefix="/api/Angkutan")


@router.post("/DKBAngkutan", response_model=schemas.DKBAngkutan)
async def create_dkb_angkutan(
    dkb_angkutan: schemas.DKBAngkutanIn,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    data = dkb_angkutan.model_dump()
    data["perusahaan_id"] = perusahaan
    barcodes = data["barcodes"]
    try:
        async with in_transaction():
            dkb_angkutan_created = await DKBAngkutan.create(**data)
            for barcode in barcodes:
                await DKBBarcode.create(
                    dkb=dkb_angkutan_created.id,
                    barcode=barcode,
                )
            await dkb_angkutan_created.fetch_related("tpk_asal", "tpk_tujuan")
            return dkb_angkutan_created
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/DKBAngkutan/GetAll", response_model=List[schemas.DKBAngkutan])
async def get_all_dkb_angkutan(
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    dkb_angkutan = await DKBAngkutan.filter(perusahaan=perusahaan).prefetch_related(
        "tpk_asal", "tpk_tujuan"
    )
    return dkb_angkutan


@router.get("/DKBAngkutan/{id}", response_model=schemas.DKBAngkutan)
async def get_dkb_angkutan(
    id: UUID,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    dkb_angkutan = await DKBAngkutan.get_or_none(
        id=id, perusahaan=perusahaan
    ).prefetch_related("tpk_asal", "tpk_tujuan")
    if not dkb_angkutan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="DKB Angkutan not found"
        )

    return dkb_angkutan


@router.put("/DKBAngkutan/{id}", response_model=Response)
async def update_dkb_angkutan(
    id: UUID,
    data: schemas.DKBAngkutanIn,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    updated_count = await DKBAngkutan.filter(id=id, perusahaan=perusahaan).update(
        **data.model_dump(exclude_unset=True)
    )
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="DKB Angkutan not found")
    return Response(message=f"Updated {updated_count} record(s)")


@router.delete("/DKBAngkutan/{id}", response_model=Response)
async def delete_dkb_angkutan(
    id: UUID,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    deleted_count = await DKBAngkutan.filter(id=id, perusahaan=perusahaan).delete()
    if deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="DKB Angkutan not found"
        )
    return Response(message=f"Deleted {deleted_count} record(s)")
