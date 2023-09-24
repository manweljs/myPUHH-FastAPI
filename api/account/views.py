from .models import *
from . import schema
from fastapi import HTTPException, status

# from sqlalchemy.orm import Session
# from sqlalchemy.ext.asyncio import AsyncSession
from .serializers import UserSerializer
import datetime
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Hash:
    def bcript(password):
        return pwd_context.hash(password)

    def verify(plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)


async def create_user(data: schema.CreateUser):
    password_hash = pwd_context.hash(data.password)
    user_data = data.model_dump(exclude_unset=True)
    user_data["password"] = password_hash
    try:
        user = await User.create(**user_data)
    except Exception as e:
        error_detail = str(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=error_detail
        )

    return await UserSerializer.from_tortoise_orm(user)


async def get_user(data: schema.CreateUser):
    password_hash = pwd_context.hash(data.password)
    user_data = data.model_dump(exclude_unset=True)
    user_data["password"] = password_hash
    print(password_hash)
    user = await User.create(**user_data)
    return await UserSerializer.from_tortoise_orm(user)


async def login(data: schema.LoginUser):
    if data.username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not Hash.verify(password, user.hashed_password):
        return False
    return user


# async def get_user(id, db) -> User:
#     return db.query(User).filter(User.id == id).first()
