from tortoise.contrib.pydantic.base import PydanticModel
from typing import Optional
from uuid import UUID, uuid4
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


class BlokBaseSchema(PydanticModel):
    id: UUID
    nama: str

    class Config:
        from_attributes = True


class BlokInSchema(PydanticModel):
    nama: str
    tahun_id: UUID

    class Config:
        from_attributes = True


class PetakSchema(PydanticModel):
    id: UUID
    nama: str
    blok: BlokBaseSchema
    luas: float

    class Config:
        from_attributes = True


class PetakInSchema(PydanticModel):
    nama: str
    blok_id: UUID
    luas: float

    class Config:
        from_attributes = True


class BaseJabatanGanisSchema(PydanticModel):
    id: UUID
    nama: str

    class Config:
        from_attributes = True


class GanisSchema(PydanticModel):
    id: UUID
    nama: str
    jabatan: BaseJabatanGanisSchema
    berlaku_dari: Optional[date] = None
    berlaku_sampai: Optional[date] = None

    class Config:
        from_attributes = True


class GanisInSchema(PydanticModel):
    nama: str
    jabatan_id: UUID
    berlaku_dari: Optional[date] = None
    berlaku_sampai: Optional[date] = None

    class Config:
        from_attributes = True
