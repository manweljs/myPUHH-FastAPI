from fastapi_crudrouter.core.tortoise import TortoiseCRUDRouter
from .models import TahunKegiatan, TPK, Blok
from fastapi import APIRouter, status, Depends, HTTPException
from typing import List
from utils.tokens import get_current_user, User, get_perusahaan
from . import schemas
from umum.schemas import Response
from account.schemas import PerusahaanSchema as Perusahaan
from utils.decorators import login_required
from uuid import UUID


router = APIRouter(tags=["Parameter"], prefix="/api/Parameter")


@router.get(
    "/TahunKegiatan/GetAll",
    response_model=List[schemas.TahunKegiatan],
    status_code=status.HTTP_200_OK,
)
async def get_all_tahun_kegiatan(perusahaan: Perusahaan = Depends(get_perusahaan)):
    data = await TahunKegiatan.filter(perusahaan=perusahaan).prefetch_related(
        "perusahaan"
    )
    return data


@router.get(
    "/TahunKegiatan/{id}",
    response_model=schemas.TahunKegiatan,
    status_code=status.HTTP_200_OK,
)
async def get_tahun_kegiatan(id: str, perusahaan: Perusahaan = Depends(get_perusahaan)):
    data = await TahunKegiatan.filter(id=id, perusahaan=perusahaan).first()
    if not data:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return data


@router.post(
    "/TahunKegiatan/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.TahunKegiatan,
)
async def create_tahun_kegiatan(
    tahun_kegiatan: schemas.TahunKegiatanIn,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    data = tahun_kegiatan.model_dump()
    data["perusahaan_id"] = perusahaan
    return await TahunKegiatan.create(**data)


@router.put(
    "/TahunKegiatan/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def update_tahun_kegiatan(
    id: str,
    tahun_kegiatan: schemas.TahunKegiatanIn,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):

    updated_count = await TahunKegiatan.filter(id=id, perusahaan=perusahaan).update(
        **tahun_kegiatan.model_dump(exclude_unset=True)
    )
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="Tahun Kegiatan not found")
    return Response(message="Data berhasil diupdate")


@router.delete(
    "/TahunKegiatan/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def delete_tahun_kegiatan(
    id: str, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    tahun_kegiatan = await TahunKegiatan.get_or_none(id=id, perusahaan=perusahaan)
    if tahun_kegiatan:
        await tahun_kegiatan.delete()
        return Response(message="Data berhasil dihapus")
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Data tidak ditemukan"
    )


@router.post(
    "/TPK/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.TPKSchema,
)
async def create_TPK(
    data: schemas.TPKInSchema, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    tpk = data.model_dump()
    tpk["perusahaan_id"] = perusahaan
    try:
        return await TPK.create(**tpk)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get(
    "/TPK/GetAll",
    response_model=List[schemas.TPKSchema],
    status_code=status.HTTP_200_OK,
)
async def get_all_TPK(perusahaan: Perusahaan = Depends(get_perusahaan)):
    data = await TPK.filter(perusahaan=perusahaan)
    return data


@router.get(
    "/TPK/{id}",
    response_model=schemas.TPKSchema,
    status_code=status.HTTP_200_OK,
)
async def get_TPK(id: str, perusahaan: Perusahaan = Depends(get_perusahaan)):
    data = await TPK.filter(id=id, perusahaan=perusahaan).first()
    if not data:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return data


@router.put(
    "/TPK/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def update_TPK(
    id: str,
    data: schemas.TPKInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):

    updated_count = await TPK.filter(id=id, perusahaan=perusahaan).update(
        **data.model_dump(exclude_unset=True)
    )
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="TPK not found")
    return Response(message="Data berhasil diupdate")


@router.delete(
    "/TPK/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def delete_TPK(id: str, perusahaan: Perusahaan = Depends(get_perusahaan)):
    tpk = await TPK.get_or_none(id=id, perusahaan=perusahaan)
    if tpk:
        await tpk.delete()
        return Response(message="Data berhasil dihapus")
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Data tidak ditemukan"
    )


@router.post(
    "/TPN/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.TPnInSchema,
)
async def create_TPn(
    data: schemas.TPnInSchema, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    tpn = data.model_dump()
    tpn["perusahaan_id"] = perusahaan
    try:
        return await TPK.create(**tpn)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get(
    "/TPN/GetAll",
    response_model=List[schemas.TPnSchema],
    status_code=status.HTTP_200_OK,
)
async def get_all_TPn(perusahaan: Perusahaan = Depends(get_perusahaan)):
    data = await TPK.filter(perusahaan=perusahaan)
    return data


@router.get(
    "/TPN/{id}",
    response_model=schemas.TPnSchema,
    status_code=status.HTTP_200_OK,
)
async def get_TPN(id: str, perusahaan: Perusahaan = Depends(get_perusahaan)):
    data = await TPK.filter(id=id, perusahaan=perusahaan).first()
    if not data:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return data


@router.put(
    "/TPN/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def update_TPn(
    id: str,
    data: schemas.TPnInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):

    updated_count = await TPK.filter(id=id, perusahaan=perusahaan).update(
        **data.model_dump(exclude_unset=True)
    )
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="TPN not found")
    return Response(message="Data berhasil diupdate")


@router.delete(
    "/TPN/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def delete_TPn(id: str, perusahaan: Perusahaan = Depends(get_perusahaan)):
    tpn = await TPK.get_or_none(id=id, perusahaan=perusahaan)
    if tpn:
        await tpn.delete()
        return Response(message="Data berhasil dihapus")
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Data tidak ditemukan"
    )


@router.post(
    "/Blok/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.BlokSchema,
)
async def create_blok(
    data: schemas.BlokInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    blok = data.model_dump()
    blok["perusahaan_id"] = str(perusahaan)
    try:
        created_blok = await Blok.create(**blok)
        await created_blok.fetch_related("tahun", "perusahaan")
        return created_blok
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get(
    "/Blok/GetAll",
    response_model=List[schemas.BlokSchema],
    status_code=status.HTTP_200_OK,
)
async def get_all_blok(perusahaan: Perusahaan = Depends(get_perusahaan)):
    data = await Blok.filter(perusahaan=perusahaan).prefetch_related("tahun")
    return data


@router.get(
    "/Blok/{id}",
    response_model=schemas.BlokSchema,
    status_code=status.HTTP_200_OK,
)
async def get_blok(id: str, perusahaan: Perusahaan = Depends(get_perusahaan)):
    data = await Blok.filter(id=id, perusahaan=perusahaan).first()
    await data.fetch_related("tahun")
    if not data:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return data
