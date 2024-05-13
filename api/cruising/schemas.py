from tortoise.contrib.pydantic.base import PydanticModel
from typing import Optional, List
from uuid import UUID
from datetime import date
from parameter.schemas import TahunKegiatanSchema
from tortoise import Tortoise
from config.db import model_list
from pydantic import BaseModel
from fastapi_pagination import Page

Tortoise.init_models(model_list, "models")


class BaseLHCSchema(PydanticModel):
    nomor: str
    tahun_id: UUID
    tanggal: date
    obyek: int

    class Config:
        from_attributes = True


class BaseBarcodeSchema(PydanticModel):
    barcode: str

    class Config:
        from_attributes = True


class LHCSchema(PydanticModel):
    id: UUID
    nomor: str
    tahun: TahunKegiatanSchema
    tanggal: date
    obyek: int

    class Config:
        from_attributes = True


class BarcodeModelSchema(BaseModel):
    barcode: str


class LHCPydanticSchema(BaseModel):
    id: UUID
    nomor: str
    tahun_id: UUID
    tanggal: date
    obyek: int

    class Config:
        from_attributes = True


class LHCInSchema(PydanticModel):
    nomor: str
    tahun_id: UUID
    tanggal: date
    obyek: int

    class Config:
        from_attributes = True


class BarcodeSchema(PydanticModel):
    id: UUID
    barcode: str
    lhc_id: UUID

    class Config:
        from_attributes = True


class LHCBarcodeSchema(PydanticModel):
    barcode: Page[str]


# Barcode = pydantic_model_creator(models.Barcode, name="BarcodeModel")


class UploadBarcodeInSchema(PydanticModel):
    lhc_id: UUID
    file_url: str

    class Config:
        from_attributes = True


class RencanaTebangSchema(PydanticModel):
    id: UUID
    nomor: str
    tahun: TahunKegiatanSchema
    obyek: int
    tanggal: date
    faktor: float

    class Config:
        from_attributes = True


class RencanaTebangInSchema(PydanticModel):
    nomor: str
    tahun_id: UUID
    obyek: int
    tanggal: date
    faktor: float

    class Config:
        from_attributes = True


class UploadPohonInSchema(PydanticModel):
    file_url: str

    class Config:
        from_attributes = True


class PohonSchema(PydanticModel):
    id: UUID
    nomor: str

    class Config:
        from_attributes = True


class PohonInSchema(PydanticModel):
    nomor: str
    barcode_id: UUID
    petak_id: UUID
    jalur: Optional[str]
    araj_jalur: Optional[str]
    panjang_jalur: Optional[int]
    jenis_id: UUID
    tinggi: Optional[float]
    diameter: Optional[float]
    volume: Optional[float]
    sortimen: Optional[int]
    koordinat_x: Optional[float]
    koordinat_y: Optional[float]

    class Config:
        from_attributes = True
