from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from . import schema
from .serializers import UserInSerializer, UserSerializer
from .models import *
from . import views
import datetime

# from conf.database import get_db


router = APIRouter(tags=["Account"], prefix="/api/Account")


@router.post("/User", status_code=status.HTTP_201_CREATED, response_model=schema.User)
async def post(data: schema.CreateUser):
    # print("data-------------------->", data)
    # defaults = {
    #     "created": datetime.datetime.utcnow(),
    #     "modified": datetime.datetime.utcnow(),
    #     "avatar": None,  # Replace with the appropriate default avatar URL
    # }
    # user_data = data.dict(exclude_unset=True)
    # user_data.update(
    #     {key: value for key, value in defaults.items() if key not in user_data}
    # )

    user = await User.create(**data.dict(exclude_unset=True))
    return await UserSerializer.from_tortoise_orm(user)

    # return await views.create_user(data)


# @router.get("/User", status_code=status.HTTP_200_OK, response_model=UserSerializer)
# async def get(id: str, db: AsyncSession = Depends(get_db)):
#     return await views.get_user(id, db)
