from uuid import UUID, uuid4
from api.account.models import Perusahaan
from api.utils.storage import get_presigned_url
from api.utils.tokens import get_perusahaan
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
    print(draft)
    data = draft.model_dump(exclude_unset=True)
    data["perusahaan_id"] = perusahaan
    pk = data.pop("id")
    if pk:
        # Update existing entry
        print("masuk sini")
        try:
            draft_instance = await SpreadsheetDraft.get(id=pk)
            for key, value in data.items():
                setattr(draft_instance, key, value)
            await draft_instance.save()
            return draft_instance
        except Exception as e:
            raise HTTPException(status_code=404, detail=str(e))
    else:
        # Create new entry

        draft_instance = await SpreadsheetDraft.create(**data)
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
):
    drafts = await SpreadsheetDraft.filter(object=type, object_id=id).all()

    if drafts:
        for draft in drafts:
            draft.file_url = await get_presigned_url(draft.file_url, "spreadsheets/")

    return drafts
