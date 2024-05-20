from pydantic import BaseModel
from tortoise.contrib.pydantic.base import PydanticModel
from typing import List, Optional
from uuid import UUID


class ResponseSchema(BaseModel):
    success: bool = True
    message: Optional[str] = None


class ErrorItem(BaseModel):
    status: str
    message: str


class ErrorResponse(BaseModel):
    success: bool = False
    errors: List[ErrorItem]


class PropinsiSchema(PydanticModel):
    id: int
    nama: str
    test: Optional[bool]

    class Config:
        from_attributes = True


class KabupatenSchema(PydanticModel):
    id: int
    nama: str
    propinsi: str
    propinsi_id: int

    class Config:
        from_attributes = True


class RencanaTebangTypeSchema(PydanticModel):
    id: int
    nama: str

    class Config:
        from_attributes = True


class KualifikasiGanisSchema(PydanticModel):
    id: int
    nama: str

    class Config:
        from_attributes = True


class JabatanGanisSchema(PydanticModel):
    id: int
    nama: str
    kualifikasi: str

    class Config:
        from_attributes = True


class KelompokJenisSchema(PydanticModel):
    id: int
    nama: str

    class Config:
        from_attributes = True


class JenisSchema(PydanticModel):
    id: int
    nama: str
    kelompok_jenis: KelompokJenisSchema

    class Config:
        from_attributes = True


# class JenisSchema(PydanticModel):
#     id: int
#     nama: str
#     kelompok_jenis: str
#     kelompok_jenis_id: int

#     class Config:
#         from_attributes = True


class SortimenSchema(PydanticModel):
    id: int
    nama: str

    class Config:
        from_attributes = True


class TarifSchema(PydanticModel):
    id: int
    nama: str
    type: int
    kelompok_jenis: KelompokJenisSchema
    sortimen: SortimenSchema
    harga: float

    class Config:
        from_attributes = True


class KelasDiameterSchema(PydanticModel):
    id: int
    nama: str

    class Config:
        from_attributes = True


class StatusPohonSchema(PydanticModel):
    id: int
    nama: str

    class Config:
        from_attributes = True


class PresignedUrlSchema(PydanticModel):
    url: str

    class Config:
        from_attributes = True


class PresignedUrlInSchema(PydanticModel):
    file_name: str

    class Config:
        from_attributes = True
