from pydantic import BaseModel, UUID4
from typing import Optional
from uuid import UUID, uuid4
from enum import Enum


class UserSchema(BaseModel):
    id: Optional[UUID] = uuid4()
    username: str
    first_name: str
    last_name: str
    password: str
    email: str
    avatar: Optional[str] = None


class PerusahaanSchema(BaseModel):
    id: UUID = uuid4()
    nama: str
    alamat: str
    logo: str


class OperatorSchema(BaseModel):
    id: UUID = uuid4()
    user: UserSchema
    perusahaan: PerusahaanSchema
