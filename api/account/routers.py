from fastapi import APIRouter, status, Depends
from . import schema
from .serializers import UserInSerializer, UserSerializer
from .models import *
from . import views
import datetime

# from conf.database import get_db


router = APIRouter(tags=["Account"], prefix="/api/Account")


@router.post("/User", status_code=status.HTTP_201_CREATED, response_model=schema.User)
async def post(data: schema.CreateUser):
    return await views.create_user(data)

    # return await views.create_user(data)


# @router.get("/User", status_code=status.HTTP_200_OK, response_model=UserSerializer)
# async def get(id: str, db: AsyncSession = Depends(get_db)):
#     return await views.get_user(id, db)
