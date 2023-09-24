from tortoise import fields
from umum.models import BaseModel
from tortoise.models import Model
from datetime import datetime
from uuid import uuid4


class User(BaseModel):
    username = fields.CharField(max_length=50)
    first_name = fields.CharField(max_length=50)
    last_name = fields.CharField(max_length=50)
    password = fields.TextField()
    email = fields.CharField(max_length=255)
    avatar = fields.TextField(null=True)

    class Meta:
        table = "users"


class Perusahaan(BaseModel):
    nama = fields.CharField(255)
    kabupaten = fields.ForeignKeyField(
        "umum.Kabupaten", on_delete=fields.SET_NULL, null=True
    )
    alamat = fields.TextField(null=True)
    logo = fields.TextField(null=True)


class Operator(BaseModel):
    user = fields.ForeignKeyField("account.User", on_delete=fields.CASCADE)
    perusahaan = fields.ForeignKeyField("account.Perusahaan", on_delete=fields.CASCADE)
    nama = fields.CharField(255)

    class Meta:
        table = "operators"
