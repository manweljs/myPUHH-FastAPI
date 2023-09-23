from pydantic import BaseModel
from typing import Optional
from uuid import UUID, uuid4
from enum import Enum
from general.serializers import BaseSerializer
from .models import *

# class UserSerializer(BaseModel):
#     id: UUID = uuid4()
#     username: str
#     first_name: str
#     last_name: str
#     password: str
#     email: str
#     avatar: Optional[str] = None


class UserSerializer(BaseSerializer):
    class Meta:
        model = User


class PerusahaanSerializer(BaseModel):
    class Meta:
        model = Perusahaan

    # id: UUID
    # nama: str
    # alamat: str
    # logo: str


class OperatorSerializer(BaseModel):
    class Meta:
        model = Operator

    # id: UUID
    # user: UserSerializer
    # perusahaan: PerusahaanSerializer
