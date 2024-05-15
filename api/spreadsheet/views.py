from .models import SpreadsheetDraft
from fastapi import APIRouter, status
from typing import List
from . import schemas


router = APIRouter(tags=["Spreadsheet"], prefix="/api/Spreadsheet")


@router.put(
    "/Draft",
    status_code=status.HTTP_200_OK,
    response_model=schemas.SpreadsheetDraftSchema,
    description="## Save draft spreadsheet\n file_url adalah url file yang diupload ke S3 storage",
)
async def save_draft_spreadsheet(
    draft: schemas.SpreadsheetDrafInSchema,
):
    draft = await SpreadsheetDraft.create(**draft.model_dump())
    return draft


@router.get(
    "/Draft",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.SpreadsheetDraftSchema],
    description="## Get draft spreadsheet by object and object_id",
)
async def get_draft_spreadsheet(
    object: str,
    object_id: str,
    version: int = 1,
):
    draft = await SpreadsheetDraft.filter(
        object=object, object_id=object_id, version=version
    ).first()
    return draft
