from tortoise.contrib.pydantic.base import PydanticModel
from typing import Optional
from uuid import UUID, uuid4
from tortoise.contrib.pydantic import pydantic_model_creator
from . import models
from datetime import date


class BasePerusahaan(PydanticModel):
    id: Optional[UUID] = uuid4()
    nama: str


class TahunKegiatan(PydanticModel):
    id: Optional[UUID] = uuid4()
    tahun: int
    tanggal_mulai: date
    tanggal_selesai: date

    class Config:
        from_attributes = True


class TahunKegiatanIn(PydanticModel):
    tahun: int
    tanggal_mulai: date
    tanggal_selesai: date

    class Config:
        from_attributes = True


class TPKSchema(PydanticModel):
    id: UUID
    nama: str
    kategori: int
    alamat: Optional[str] = None

    class Config:
        from_attributes = True


class TPKInSchema(PydanticModel):
    nama: str
    kategori: int
    alamat: Optional[str] = None

    class Config:
        from_attributes = True


class TPnSchema(PydanticModel):
    id: UUID
    nama: str

    class Config:
        from_attributes = True


class TPnInSchema(PydanticModel):
    nama: str

    class Config:
        from_attributes = True


class BlokSchema(PydanticModel):
    id: UUID
    nama: str
    tahun: TahunKegiatan

    class Config:
        from_attributes = True


class BlokInSchema(PydanticModel):
    nama: str
    tahun_id: str

    class Config:
        from_attributes = True
