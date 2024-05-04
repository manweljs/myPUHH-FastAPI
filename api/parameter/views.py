from fastapi_crudrouter.core.tortoise import TortoiseCRUDRouter
from .models import TahunKegiatan
from fastapi import APIRouter, status, Depends
from typing import List
from utils.tokens import get_current_user, User
from . import schemas

router = APIRouter(tags=["Tahun Kegiatan"], prefix="/api/TahunKegiatan")


@router.get(
    "",
    response_model=List[schemas.TahunKegiatan],
    status_code=status.HTTP_200_OK,
)
async def get_all(user: User = Depends(get_current_user)):
    if not user.perusahaan:
        return None

    return await TahunKegiatan.all()
