from pydantic import BaseModel, UUID4
from typing import Optional
from uuid import UUID, uuid4
from enum import Enum


class User(BaseModel):
    id: Optional[UUID] = uuid4()
    username: str
    first_name: str
    last_name: str
    email: str
    avatar: Optional[str] = None

    class Config:
        from_attributes = True


class CreateUser(BaseModel):
    username: str
    first_name: str
    last_name: str
    password: str
    email: str
    avatar: Optional[str] = None

    class Config:
        from_attributes = True


class LoginUser(BaseModel):
    username: str
    password: str

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    access_token: str
    token_type: str


# class PerusahaanSchema(BaseModel):
#     id: Optional[UUID] = uuid4()
#     nama: str
#     alamat: str
#     logo: Optional[str] = None


# class OperatorSchema(BaseModel):
#     id: Optional[UUID] = uuid4()
#     user: UserSchema
#     perusahaan: PerusahaanSchema
