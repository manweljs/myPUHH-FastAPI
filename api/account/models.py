from tortoise import fields
from umum.models import CustomModel
from tortoise.models import Model
from datetime import datetime
from uuid import uuid4


class User(CustomModel):
    username = fields.CharField(max_length=50, unique=True)
    first_name = fields.CharField(max_length=50)
    last_name = fields.CharField(max_length=50)
    password = fields.TextField()
    email = fields.CharField(max_length=255, unique=True)
    avatar = fields.TextField(null=True)

    class Meta:
        table = "users"

    def __str__(self):
        return self.username


class Perusahaan(CustomModel):
    nama = fields.CharField(255)
    kabupaten = fields.ForeignKeyField(
        "umum.Kabupaten", on_delete=fields.SET_NULL, null=True
    )
    alamat = fields.TextField(null=True)
    logo = fields.TextField(null=True)


class Operator(CustomModel):
    user = fields.ForeignKeyField("account.User", on_delete=fields.CASCADE)
    perusahaan = fields.ForeignKeyField("account.Perusahaan", on_delete=fields.CASCADE)
    nama = fields.CharField(255)

    class Meta:
        table = "operators"


class Token(CustomModel):
    access_token = fields.TextField()
    token_type = fields.TextField()

    class Meta:
        table = "tokens"
