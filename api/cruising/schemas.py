from tortoise.contrib.pydantic.base import PydanticModel
from typing import Optional
from uuid import UUID, uuid4
from tortoise.contrib.pydantic import pydantic_model_creator
from . import models
from datetime import date
from parameter.schemas import TahunKegiatan
from fastapi import UploadFile
from pydantic import Field


class BaseLHC(PydanticModel):
    nomor: str
    tahun_id: UUID
    tanggal: date
    obyek: int

    class Config:
        from_attributes = True


class LHC(PydanticModel):
    id: UUID
    nomor: str
    tahun: TahunKegiatan
    tanggal: date
    obyek: int

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

    class Config:
        from_attributes = True


class UploadBarcodeIn(PydanticModel):
    lhc_id: UUID
    file_url: str

    class Config:
        from_attributes = True
