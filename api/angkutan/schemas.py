from tortoise.contrib.pydantic.base import PydanticModel
from typing import Optional, List
from uuid import UUID
from datetime import date


# membuat schema untuk model angkutan


class DKBAngkutanIn(PydanticModel):
    nomor_dkb: str
    nomor_dokumen: str
    tanggal: date
    tpk_asal_id: UUID
    tpk_tujuan_id: UUID
    alat_angkut: int
    nama_alat_angkut: Optional[str]
    dokumen_url: Optional[str]
    barcodes: List[UUID]

    class Config:
        from_attributes = True


class DKBAngkutan(PydanticModel):
    perusahaan_id: UUID
    id: UUID
    nomor_dkb: str
    nomor_dokumen: str
    tanggal: date
    tpk_asal: UUID
    tpk_tujuan: UUID
    alat_angkut: int
    nama_alat_angkut: Optional[str]
    dokumen_url: Optional[str]
    barcodes: List[UUID]

    class Config:
        from_attributes = True


class DKBBarcode(PydanticModel):
    dkb: UUID
    barcode: UUID

    class Config:
        from_attributes = True
