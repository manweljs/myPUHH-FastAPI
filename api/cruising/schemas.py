from tortoise.contrib.pydantic.base import PydanticModel
from typing import Optional, List, Union
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


class PohonInSchema(BaseModel):
    id: Optional[UUID] = None
    nomor: int
    barcode: Optional[str] = None
    petak: str
    jalur: Optional[str] = None
    arah_jalur: Optional[str] = None
    panjang_jalur: Optional[int] = None
    jenis: str
    tinggi: float
    diameter: float
    volume: float
    sortimen: int
    koordinat_x: Optional[Union[float, str]] = None
    koordinat_y: Optional[Union[float, str]] = None

    class Config:
        from_attributes = True


class SaveLHCBarcodeItemSchema(PydanticModel):
    id: Optional[str]
    barcode: str


class SaveLHCBarcodeSchema(PydanticModel):
    lhc_id: UUID
    barcodes: List[SaveLHCBarcodeItemSchema]

    class Config:
        from_attributes = True
