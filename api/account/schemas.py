from typing import Optional
from uuid import UUID, uuid4
from tortoise.contrib.pydantic.base import PydanticModel

# Tortoise.init_models(["account.models", "umum.models", "parameter.models"], "models")


class UserSchema(PydanticModel):
    id: Optional[UUID] = uuid4()
    username: str
    first_name: str
    last_name: str
    email: str
    avatar: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True


class CreateUserSchema(PydanticModel):
    username: str
    first_name: str
    last_name: str
    password: str
    email: str
    avatar: Optional[str] = None

    class Config:
        from_attributes = True


class LoginUserSchema(PydanticModel):
    username: str
    password: str

    class Config:
        from_attributes = True


class LoginResponseSchema(PydanticModel):
    access_token: str
    token_type: str


class KabupatenBaseSchema(PydanticModel):
    id: UUID
    nama: str

    class Config:
        from_attributes = True


class PerusahaanSchema(PydanticModel):
    id: UUID
    nama: str
    alamat: Optional[str]
    logo: Optional[str]
    kabupaten: Optional[KabupatenBaseSchema]  # Nested model untuk Kabupaten

    class Config:
        from_attributes = True


class PerusahaanInSchema(PydanticModel):
    nama: str
    alamat: Optional[str] = None
    logo: Optional[str] = None
    kabupaten: Optional[UUID] = None
