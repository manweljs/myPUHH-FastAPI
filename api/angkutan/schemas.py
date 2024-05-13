from tortoise.contrib.pydantic.base import PydanticModel
from typing import Optional, List
from uuid import UUID
from datetime import date

from parameter.schemas import TPKSchema


# membuat schema untuk model angkutan


class DKBAngkutanBaseSchema(PydanticModel):
    id: UUID
    nomor_dkb: str
    nomor_dokumen: str
    tanggal: date
    tpk_asal: TPKSchema
    tpk_tujuan: TPKSchema
    alat_angkut: int
    nama_alat_angkut: Optional[str]
    dokumen_url: Optional[str]

    class Config:
        from_attributes = True


class DKBAngkutanInSchema(PydanticModel):
    nomor_dkb: str
    nomor_dokumen: str
    tanggal: date
    tpk_asal_id: UUID
    tpk_tujuan_id: UUID
    alat_angkut: int
    nama_alat_angkut: Optional[str]
    dokumen_url: Optional[str]

    class Config:
        from_attributes = True


class DKBAngkutanSchema(PydanticModel):
    perusahaan_id: UUID
    id: UUID
    nomor_dkb: str
    nomor_dokumen: str
    tanggal: date
    tpk_asal: TPKSchema
    tpk_tujuan: TPKSchema
    alat_angkut: int
    nama_alat_angkut: Optional[str]
    dokumen_url: Optional[str]

    class Config:
        from_attributes = True


class DKBBarcodeSchema(PydanticModel):
    dkb: UUID
    barcode: UUID

    class Config:
        from_attributes = True
