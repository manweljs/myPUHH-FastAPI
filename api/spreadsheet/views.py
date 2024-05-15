from uuid import UUID
from account.models import Perusahaan
from utils.storage import get_presigned_url
from utils.tokens import get_perusahaan
from .models import SpreadsheetDraft
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from . import schemas


router = APIRouter(tags=["Spreadsheet"], prefix="/api/Spreadsheet")


@router.put(
    "/Draft/",
    status_code=status.HTTP_200_OK,
    response_model=schemas.SpreadsheetDraftSchema,
    description="## Save draft spreadsheet\n file_url adalah url file yang diupload ke S3 storage",
)
async def save_draft_spreadsheet(
    draft: schemas.SpreadsheetDrafInSchema,
    perusahaan: Perusahaan = Depends(get_perusahaan),
):
    print("draft--->", draft)
    data = draft.model_dump(exclude_unset=True)

    # Pisahkan 'id' dari data lain jika ada
    draft_id = data.pop("id", None)

    # Gunakan 'id' secara eksplisit sebagai parameter pencarian dan sisa data sebagai defaults
    draft_instance, created = await SpreadsheetDraft.update_or_create(
        id=draft_id,  # id digunakan untuk mencari instance yang ada
        defaults=data,  # sisa data yang akan di-set jika membuat baru atau update yang ada
    )
    return draft_instance


@router.get(
    "/Draft/",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.SpreadsheetDraftSchema],
    description="## Get draft spreadsheet by object type and object id\n contoh object type: lhc, lhp, buku_ukur",
)
async def get_draft_spreadsheets(
    type: str,
    id: str,
    version: int = 1,
):
    drafts = await SpreadsheetDraft.filter(
        object=type, object_id=id, version=version
    ).all()

    if drafts:
        for draft in drafts:
            draft.file_url = await get_presigned_url(draft.file_url, "spreadsheets/")

    return drafts
