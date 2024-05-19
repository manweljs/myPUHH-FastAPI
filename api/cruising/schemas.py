from re import S
import uuid
from numpy import number
from tortoise.contrib.pydantic.base import PydanticModel
from typing import Optional, List, Union
from uuid import UUID
from datetime import date
from umum.schemas import (
    JenisSchema,
    KelasDiameterSchema,
    SortimenSchema,
    StatusPohonSchema,
)
from parameter.schemas import PetakBaseSchema, PetakSchema, TahunKegiatanSchema
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
    total_pohon: Optional[int] = 0
    total_volume: Optional[float] = 0

    class Config:
        from_attributes = True


class LHCBaseSchema(PydanticModel):
    id: UUID
    nomor: str
    tahun: int
    tanggal: date
    obyek: int
    total_pohon: Optional[int] = 0
    total_volume: Optional[float] = 0

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
    nomor: int
    petak: Optional[PetakBaseSchema] = None
    jalur: str
    arah_jalur: str
    panjang_jalur: int
    jenis: JenisSchema
    tinggi: float
    diameter: float
    volume: float
    sortimen: SortimenSchema
    koordinat_x: Union[float, str]
    koordinat_y: Union[float, str]
    kelas_diameter: Optional[KelasDiameterSchema]
    status_pohon: Optional[StatusPohonSchema] = None
    barcode: Optional[BarcodeModelSchema] = None

    class Config:
        from_attributes = True


class PohonInSchema(BaseModel):
    id: Optional[UUID] = None
    jenis_id: int
    petak_id: str
    tinggi: float
    sortimen_id: int
    status_pohon_id: Optional[int] = None

    nomor: int
    jalur: Optional[str] = None
    arah_jalur: Optional[str] = None
    panjang_jalur: Optional[int] = None
    diameter: float
    volume: float
    kelas_diameter_id: Optional[int] = None
    koordinat_x: Optional[Union[float, str]] = None
    koordinat_y: Optional[Union[float, str]] = None
    barcode: Optional[str] = None

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
