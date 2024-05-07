from .models import (
    Propinsi,
    Kabupaten,
    RencanaTebangType,
    KualifikasiGanis,
    JabatanGanis,
    KelompokJenis,
    Jenis,
    Sortimen,
    Tarif,
)
from fastapi import APIRouter, status
from typing import List
from . import schemas


router = APIRouter(tags=["Umum"], prefix="/api/Umum")


@router.get(
    "/Propinsi",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.PropinsiSchema],
)
async def get_all_propinsi():
    propinsi = await Propinsi.all()
    return propinsi


@router.get(
    "/Kabupaten",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.KabupatenSchema],
)
async def get_all_kabupaten():
    kabupaten = await Kabupaten.all().prefetch_related("propinsi")
    return kabupaten


@router.get(
    "/RencanaTebangType",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.RencanaTebangTypeSchema],
)
async def get_all_rencana_tebang_type():
    rencana_tebang_type = await RencanaTebangType.all()
    return rencana_tebang_type


@router.get(
    "/KualifikasiGanis",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.KualifikasiGanisSchema],
)
async def get_all_kualifikasi_ganis():
    kualifikasi_ganis = await KualifikasiGanis.all()
    return kualifikasi_ganis


@router.get(
    "/JabatanGanis",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.JabatanGanisSchema],
)
async def get_all_jabatan_ganis():
    jabatan_ganis = await JabatanGanis.all().prefetch_related("kualifikasi")
    return jabatan_ganis


@router.get(
    "/KelompokJenis",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.KelompokJenisSchema],
)
async def get_all_kelompok_jenis():
    kelompok_jenis = await KelompokJenis.all()
    return kelompok_jenis


@router.get(
    "/Jenis",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.JenisSchema],
)
async def get_all_jenis():
    jenis = await Jenis.all().prefetch_related("kelompok_jenis")
    return jenis


@router.get(
    "/Sortimen",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.SortimenSchema],
)
async def get_all_sortimen():
    sortimen = await Sortimen.all()
    return sortimen


@router.get(
    "/Tarif",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.TarifSchema],
)
async def get_all_tarif():
    tarif = await Tarif.all().prefetch_related("kelompok_jenis", "sortimen")
    return tarif
