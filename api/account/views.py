from .models import User
from . import schema
from fastapi import HTTPException, status

# from sqlalchemy.orm import Session
# from sqlalchemy.ext.asyncio import AsyncSession
from .serializers import UserSerializer
import datetime
from passlib.context import CryptContext
from utils.tokens import create_access_token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Hash:
    def bcript(password):
        return pwd_context.hash(password)

    def verify(plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)


async def authenticate_user(username, password):
    user = await User.get_or_none(username=username)
    if not user:
        return False
    if not Hash.verify(password, user.password):
        return False
    return user


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


async def get_user(user):
    return await UserSerializer.from_tortoise_orm(user)


async def login(data: schema.LoginUser):
    user = await User.get_or_none(username=data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    if not Hash.verify(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User not found"
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


# async def get_user(id, db) -> User:
#     return db.query(User).filter(User.id == id).first()
