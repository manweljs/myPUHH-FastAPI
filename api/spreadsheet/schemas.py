# schemas untuk spreadsheet
from tortoise.contrib.pydantic.base import PydanticModel
from typing import Optional
from uuid import UUID, uuid4
from datetime import date
from .models import SpreadsheetDraft


class SpreadsheetDrafInSchema(PydanticModel):
    id: Optional[UUID]
    title: str
    object: str
    object_id: UUID
    file_url: str
    version: int

    class Config:
        from_attributes = True


class SpreadsheetDraftSchema(PydanticModel):
    id: UUID
    title: str
    object: str
    object_id: UUID
    file_url: str
    version: int

    class Config:
        from_attributes = True


class SpreadsheetParamsSchema(PydanticModel):
    object: str
    object_id: UUID
    version: Optional[int]

    class Config:
        from_attributes = True
