from typing import Optional, List
from uuid import UUID, uuid4
from enum import Enum
from tortoise.contrib.pydantic import pydantic_model_creator
from tortoise.contrib.pydantic.base import PydanticModel
from tortoise import Tortoise
from . import models
from pydantic import validator

Tortoise.init_models(["account.models", "umum.models"], "models")


class User(PydanticModel):
    id: Optional[UUID] = uuid4()
    username: str
    first_name: str
    last_name: str
    email: str
    avatar: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True


class CreateUser(PydanticModel):
    username: str
    first_name: str
    last_name: str
    password: str
    email: str
    avatar: Optional[str] = None

    class Config:
        from_attributes = True


class LoginUser(PydanticModel):
    username: str
    password: str

    class Config:
        from_attributes = True


class LoginResponse(PydanticModel):
    access_token: str
    token_type: str


class KabupatenBase(PydanticModel):
    id: UUID
    nama: str

    class Config:
        orm_mode = True


class PerusahaanSchema(PydanticModel):
    id: UUID
    nama: str
    alamat: Optional[str]
    logo: Optional[str]
    kabupaten: Optional[KabupatenBase]  # Nested model untuk Kabupaten

    class Config:
        orm_mode = True


class PerusahaanIn(PydanticModel):
    nama: str
    alamat: Optional[str] = None
    logo: Optional[str] = None
    kabupaten: Optional[UUID] = None
