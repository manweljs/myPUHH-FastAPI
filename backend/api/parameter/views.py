from .models import TPn, TahunKegiatan, TPK, Blok, Petak, Ganis
from fastapi import APIRouter, status, Depends, HTTPException
from typing import List, Optional
from api.utils.tokens import get_perusahaan
from . import schemas
from api.umum.schemas import ResponseSchema as Response
from api.account.schemas import PerusahaanSchema as Perusahaan


router = APIRouter(tags=["Parameter"], prefix="/api/Parameter")


@router.get(
    "/TahunKegiatan/GetAll",
    response_model=List[schemas.TahunKegiatanSchema],
    status_code=status.HTTP_200_OK,
)
async def get_all_tahun_kegiatan(perusahaan: Perusahaan = Depends(get_perusahaan)):
    data = (
        await TahunKegiatan.filter(perusahaan=perusahaan)
        .prefetch_related("perusahaan")
        .order_by("tahun")
    )
    return data


@router.get(
    "/TahunKegiatan/{id}",
    response_model=schemas.TahunKegiatanSchema,
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
    response_model=schemas.TahunKegiatanSchema,
)
async def create_tahun_kegiatan(
    tahun_kegiatan: schemas.TahunKegiatanInSchema,
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
    tahun_kegiatan: schemas.TahunKegiatanInSchema,
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
    "/TPn/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.TPnSchema,
)
async def create_TPn(
    data: schemas.TPnInSchema, perusahaan: Perusahaan = Depends(get_perusahaan)
):
    print("masuk create TPn")
    tpn = data.model_dump()
    tpn["perusahaan_id"] = perusahaan
    print(tpn)
    try:
        tpn = await TPn.create(**tpn)
        await tpn.fetch_related("blok")
        return tpn
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get(
    "/TPn/GetAll",
    response_model=List[schemas.TPnSchema],
    status_code=status.HTTP_200_OK,
)
async def get_all_TPn(perusahaan: Perusahaan = Depends(get_perusahaan)):
    data = await TPn.filter(perusahaan=perusahaan).prefetch_related("blok")
    return data


@router.get(
    "/TPn/{id}",
    response_model=schemas.TPnSchema,
    status_code=status.HTTP_200_OK,
)
async def get_TPN(id: str, perusahaan: Perusahaan = Depends(get_perusahaan)):
    data = (
        await TPn.filter(id=id, perusahaan=perusahaan).first().prefetch_related("blok")
    )
    if not data:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    return data


@router.put(
    "/TPn/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def update_TPn(
    id: str,
    data: schemas.TPnInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    print("masuk update TPn")
    updated_count = await TPn.filter(id=id, perusahaan=perusahaan).update(
        **data.model_dump(exclude_unset=True)
    )
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="TPN not found")
    return Response(message="Data berhasil diupdate")


@router.delete(
    "/TPn/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def delete_TPn(id: str, perusahaan: Perusahaan = Depends(get_perusahaan)):
    tpn = await TPn.get_or_none(id=id, perusahaan=perusahaan)
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
    data = data.model_dump()
    data["perusahaan_id"] = perusahaan
    try:
        created_blok = await Blok.create(**data)
        await created_blok.fetch_related("tahun")
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


@router.put(
    "/Blok/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def update_blok(
    id: str,
    data: schemas.BlokInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):

    updated_count = await Blok.filter(id=id, perusahaan=perusahaan).update(
        **data.model_dump(exclude_unset=True)
    )
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="Blok not found")
    return Response(message="Data berhasil diupdate")


@router.delete(
    "/Blok/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def delete_blok(id: str, perusahaan: Perusahaan = Depends(get_perusahaan)):
    blok = await Blok.get_or_none(id=id, perusahaan=perusahaan)
    if blok:
        await blok.delete()
        return Response(message="Data berhasil dihapus")
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Data tidak ditemukan"
    )


@router.post(
    "/Petak/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.PetakSchema,
)
async def create_petak(
    data: schemas.PetakInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    data = data.model_dump()
    data["perusahaan_id"] = perusahaan
    try:
        created_petak = await Petak.create(**data)
        await created_petak.fetch_related("blok")
        return created_petak
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get(
    "/Petak/GetAll",
    response_model=List[schemas.PetakSchema],
    status_code=status.HTTP_200_OK,
)
async def get_all_petak(
    tahun_kegiatan: Optional[int] = None,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    filter_kwargs = {"perusahaan": perusahaan}
    if tahun_kegiatan:
        filter_kwargs["blok__tahun__tahun"] = tahun_kegiatan

    data = await Petak.filter(**filter_kwargs).prefetch_related("blok")
    return data


@router.get(
    "/Petak/{id}",
    response_model=schemas.PetakSchema,
    status_code=status.HTTP_200_OK,
)
async def get_petak(id: str, perusahaan: Perusahaan = Depends(get_perusahaan)):
    data = await Petak.filter(id=id, perusahaan=perusahaan).first()
    if not data:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")

    await data.fetch_related("blok")
    return data


@router.put(
    "/Petak/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def update_petak(
    id: str,
    data: schemas.PetakInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):

    updated_count = await Petak.filter(id=id, perusahaan=perusahaan).update(
        **data.model_dump(exclude_unset=True)
    )
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="Petak not found")
    return Response(message="Data berhasil diupdate")


@router.delete(
    "/Petak/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def delete_petak(id: str, perusahaan: Perusahaan = Depends(get_perusahaan)):
    petak = await Petak.get_or_none(id=id, perusahaan=perusahaan)
    if petak:
        await petak.delete()
        return Response(message="Data berhasil dihapus")
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Data tidak ditemukan"
    )


@router.post(
    "/Ganis/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.GanisSchema,
)
async def create_ganis(
    data: schemas.GanisInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    data = data.model_dump()
    data["perusahaan_id"] = perusahaan
    try:
        ganis = await Ganis.create(**data)
        await ganis.fetch_related("jabatan")
        return ganis
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get(
    "/Ganis/GetAll",
    response_model=List[schemas.GanisSchema],
    status_code=status.HTTP_200_OK,
)
async def get_all_ganis(perusahaan: Perusahaan = Depends(get_perusahaan)):
    data = await Ganis.filter(perusahaan=perusahaan).prefetch_related("jabatan")
    return data


@router.get(
    "/Ganis/{id}",
    response_model=schemas.GanisSchema,
    status_code=status.HTTP_200_OK,
)
async def get_ganis(id: str, perusahaan: Perusahaan = Depends(get_perusahaan)):
    data = await Ganis.filter(id=id, perusahaan=perusahaan).first()
    if not data:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    await data.fetch_related("jabatan")
    return data


@router.put(
    "/Ganis/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def update_ganis(
    id: str,
    data: schemas.GanisInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):

    updated_count = await Ganis.filter(id=id, perusahaan=perusahaan).update(
        **data.model_dump(exclude_unset=True)
    )
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="Ganis not found")
    return Response(message="Data berhasil diupdate")


@router.delete(
    "/Ganis/{id}",
    status_code=status.HTTP_200_OK,
    response_model=Response,
)
async def delete_ganis(id: str, perusahaan: Perusahaan = Depends(get_perusahaan)):
    ganis = await Ganis.get_or_none(id=id, perusahaan=perusahaan)
    if ganis:
        await ganis.delete()
        return Response(message="Data berhasil dihapus")
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Data tidak ditemukan"
    )
