# schemas untuk produksi
from tortoise.contrib.pydantic.base import PydanticModel
from typing import Optional
from uuid import UUID, uuid4
from datetime import date
from cruising.schemas import BaseBarcodeSchema
from umum.schemas import JenisSchema


class BukuUkurSchema(PydanticModel):
    id: UUID
    nomor: str
    tanggal: date
    obyek: int

    class Config:
        from_attributes = True


class BukuUkurInSchema(PydanticModel):
    nomor: str
    tanggal: date
    obyek: int

    class Config:
        from_attributes = True


class TebanganSchema(PydanticModel):
    id: UUID
    buku_ukur_id: UUID
    barcode: BaseBarcodeSchema
    nomor: int
    panjang: float
    dp: int
    du: int
    diameter: int
    jenis: JenisSchema
    cacat: int
    cacat_cm: Optional[int]
    cacat_persen: Optional[float]
    volume: float
    potongan: Optional[str]
    sortimen: str

    class Config:
        from_attributes = True


class TebanganInSchema(PydanticModel):
    buku_ukur_id: UUID
    petak: Optional[UUID]
    barcode: BaseBarcodeSchema
    nomor: int
    panjang: float
    dp: int
    du: int
    diameter: int
    jenis: UUID
    cacat: int
    cacat_cm: Optional[int]
    cacat_persen: Optional[float]
    volume: float
    potongan: Optional[str]
    sortimen: str

    class Config:
        from_attributes = True
