from uuid import uuid4, UUID
from tortoise.models import Model
from tortoise import fields
from datetime import datetime


class CustomModel(Model):
    id = fields.UUIDField(default=uuid4, pk=True, unique=True)
    created = fields.DatetimeField(auto_now_add=True)
    modified = fields.DatetimeField(auto_now=True)

    class Meta:
        abstract = True


class Propinsi(CustomModel):
    nama = fields.CharField(255)


class Kabupaten(CustomModel):
    nama = fields.CharField(255)
    propinsi = fields.ForeignKeyField("models.Propinsi", on_delete=fields.CASCADE)


class RencanaTebangType(CustomModel):
    nama = fields.CharField(255)
