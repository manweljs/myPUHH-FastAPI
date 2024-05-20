# views untuk produksi
from uuid import UUID
from .models import BukuUkur, DK, LHP
from fastapi import APIRouter, status, Depends, HTTPException
from typing import List
from . import schemas
from api.utils.tokens import get_perusahaan
from api.umum.schemas import ResponseSchema as Response


router = APIRouter(tags=["Produksi"], prefix="/api/Produksi")


@router.post(
    "/BukuUkur",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.BukuUkurSchema,
)
async def create_buku_ukur(
    buku_ukur: schemas.BukuUkurInSchema, perusahaan: str = Depends(get_perusahaan)
):
    print(buku_ukur)
    data = buku_ukur.model_dump()
    data["perusahaan_id"] = perusahaan
    try:
        buku_ukur_created = await BukuUkur.create(**data)
        await buku_ukur_created.fetch_related("tahun")
        return buku_ukur_created
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))


@router.get(
    "/BukuUkur/GetAll",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.BukuUkurSchema],
)
async def get_all_buku_ukur(perusahaan: str = Depends(get_perusahaan)):
    try:
        buku_ukur = await BukuUkur.filter(perusahaan=perusahaan).prefetch_related(
            "tahun"
        )
        return buku_ukur
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))


@router.get(
    "/BukuUkur/{id}",
    status_code=status.HTTP_200_OK,
    response_model=schemas.BukuUkurSchema,
)
async def get_buku_ukur(id: UUID, perusahaan: str = Depends(get_perusahaan)):
    try:
        buku_ukur = await BukuUkur.get_or_none(
            id=id, perusahaan=perusahaan
        ).prefetch_related("tahun")
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))
    return buku_ukur


@router.put(
    "/BukuUkur/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def update_buku_ukur(id: str, buku_ukur: schemas.BukuUkurInSchema):
    updated_count = await BukuUkur.filter(id=id).update(
        **buku_ukur.model_dump(exclude_unset=True)
    )
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="Buku Ukur not found")
    return Response(message="Data berhasil diupdate")


@router.delete(
    "/BukuUkur/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def delete_buku_ukur(id: UUID):
    buku_ukur = await BukuUkur.get_or_none(id=id)
    if not buku_ukur:
        raise HTTPException(status_code=404, detail="Buku Ukur not found")
    await buku_ukur.delete()
    return Response(message="Buku Ukur deleted")


@router.post(
    "/DK",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.DKSchema,
)
async def create_dk(dk: schemas.DKInSchema, perusahaan: str = Depends(get_perusahaan)):
    data = dk.model_dump()
    data["perusahaan_id"] = perusahaan
    try:
        dk_created = await DK.create(**data)
        return dk_created
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))


@router.get(
    "/DK/GetAll",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.DKSchema],
)
async def get_all_dk(perusahaan: str = Depends(get_perusahaan)):
    try:
        dk = await DK.filter(perusahaan=perusahaan)
        return dk
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))


@router.get(
    "/DK/{id}",
    status_code=status.HTTP_200_OK,
    response_model=schemas.DKSchema,
)
async def get_dk(id: UUID, perusahaan: str = Depends(get_perusahaan)):
    try:
        dk = await DK.get_or_none(id=id, perusahaan=perusahaan)
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))
    return dk


@router.put(
    "/DK/{id}",
    status_code=status.HTTP_200_OK,
    response_model=schemas.DKSchema,
)
async def update_dk(id: str, dk: schemas.DKInSchema):
    updated_count = await DK.filter(id=id).update(**dk.model_dump(exclude_unset=True))
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="DK not found")
    return Response(message="Data berhasil diupdate")


@router.delete(
    "/DK/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def delete_dk(id: UUID):
    dk = await DK.get_or_none(id=id)
    if not dk:
        raise HTTPException(status_code=404, detail="DK not found")
    await dk.delete()
    return Response(message="DK deleted")


@router.post(
    "/LHP",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.LHPSchema,
)
async def create_lhp(
    lhp: schemas.LHPInSchema, perusahaan: str = Depends(get_perusahaan)
):
    data = lhp.model_dump()
    data["perusahaan_id"] = perusahaan
    try:
        lhp_created = await LHP.create(**data)
        await lhp_created.fetch_related("tahun")
        return lhp_created
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))


@router.get(
    "/LHP/GetAll",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.LHPSchema],
)
async def get_all_lhp(perusahaan: str = Depends(get_perusahaan)):
    try:
        lhp = await LHP.filter(perusahaan=perusahaan).prefetch_related("tahun")
        return lhp
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))


@router.get(
    "/LHP/{id}",
    status_code=status.HTTP_200_OK,
    response_model=schemas.LHPSchema,
)
async def get_lhp(id: UUID, perusahaan: str = Depends(get_perusahaan)):
    try:
        lhp = await LHP.get_or_none(id=id, perusahaan=perusahaan)
        await lhp.fetch_related("tahun")
        return lhp
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))


@router.put(
    "/LHP/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def update_lhp(id: str, lhp: schemas.LHPInSchema):
    updated_count = await LHP.filter(id=id).update(**lhp.model_dump(exclude_unset=True))
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="LHP not found")
    return Response(message="Data berhasil diupdate")


@router.delete(
    "/LHP/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def delete_lhp(id: UUID):
    lhp = await LHP.get_or_none(id=id)
    if not lhp:
        raise HTTPException(status_code=404, detail="LHP not found")
    await lhp.delete()
    return Response(message="LHP deleted")
