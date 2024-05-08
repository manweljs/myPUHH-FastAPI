from tortoise.contrib.pydantic.base import PydanticModel
from typing import Optional
from uuid import UUID


class ResponseSchema(PydanticModel):
    success: bool = True
    message: Optional[str] = None


class PropinsiSchema(PydanticModel):
    id: UUID
    nama: str

    class Config:
        from_attributes = True


class KabupatenSchema(PydanticModel):
    id: UUID
    nama: str
    propinsi: PropinsiSchema

    class Config:
        from_attributes = True


class RencanaTebangTypeSchema(PydanticModel):
    id: UUID
    nama: str

    class Config:
        from_attributes = True


class KualifikasiGanisSchema(PydanticModel):
    id: UUID
    nama: str

    class Config:
        from_attributes = True


class JabatanGanisSchema(PydanticModel):
    id: UUID
    nama: str
    kualifikasi: KualifikasiGanisSchema

    class Config:
        from_attributes = True


class KelompokJenisSchema(PydanticModel):
    id: UUID
    nama: str

    class Config:
        from_attributes = True


class JenisSchema(PydanticModel):
    id: UUID
    nama: str
    kelompok_jenis: KelompokJenisSchema

    class Config:
        from_attributes = True


class SortimenSchema(PydanticModel):
    id: UUID
    nama: str

    class Config:
        from_attributes = True


class TarifSchema(PydanticModel):
    id: UUID
    nama: str
    type: int
    kelompok_jenis: KelompokJenisSchema
    sortimen: SortimenSchema
    harga: float

    class Config:
        from_attributes = True


class KelasDiameterSchema(PydanticModel):
    id: UUID
    nama: str

    class Config:
        from_attributes = True
