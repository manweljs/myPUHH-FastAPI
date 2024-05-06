from tortoise.contrib.pydantic.base import PydanticModel
from typing import Optional, List
from uuid import UUID, uuid4
from tortoise.contrib.pydantic import pydantic_model_creator
from . import models
from datetime import date
from parameter.schemas import TahunKegiatan
from fastapi import UploadFile
from pydantic import Field
from tortoise import Tortoise
from db import model_list
from pydantic import root_validator, BaseModel, validator

Tortoise.init_models(model_list, "models")


class BaseLHC(PydanticModel):
    nomor: str
    tahun_id: UUID
    tanggal: date
    obyek: int

    class Config:
        from_attributes = True


class BaseBarcode(PydanticModel):
    barcode: str

    class Config:
        from_attributes = True


class LHC(PydanticModel):
    id: UUID
    nomor: str
    tahun: TahunKegiatan
    tanggal: date
    obyek: int
    barcode: List[BaseBarcode]

    class Config:
        from_attributes = True


class BarcodeModel(BaseModel):
    barcode: str


class LHCPydantic(BaseModel):
    id: UUID
    nomor: str
    tahun_id: UUID
    tanggal: date
    obyek: int
    barcode: List[BarcodeModel]

    class Config:
        from_attributes = True


class LHCIn(PydanticModel):
    nomor: str
    tahun_id: UUID
    tanggal: date
    obyek: int

    class Config:
        from_attributes = True


class Barcode(PydanticModel):
    id: UUID
    barcode: str
    lhc_id: UUID

    class Config:
        from_attributes = True


# Barcode = pydantic_model_creator(models.Barcode, name="BarcodeModel")


class UploadBarcodeIn(PydanticModel):
    lhc_id: UUID
    file_url: str

    class Config:
        from_attributes = True


class RencanaTebang(PydanticModel):
    id: UUID
    nomor: str
    tahun_id: UUID
    obyek: int
    tanggal: date
    faktor: float

    class Config:
        from_attributes = True


class RencanaTebangIn(PydanticModel):
    nomor: str
    tahun_id: UUID
    obyek: int
    tanggal: date
    faktor: float

    class Config:
        from_attributes = True


class UploadPohonIn(PydanticModel):
    file_url: str

    class Config:
        from_attributes = True


class Pohon(PydanticModel):
    id: UUID
    nomor: str

    class Config:
        from_attributes = True


class PohonIn(PydanticModel):
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
