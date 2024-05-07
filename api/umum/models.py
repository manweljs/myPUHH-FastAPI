from uuid import uuid4
from tortoise.models import Model
from tortoise import fields
from consts import TARIF_TYPE, SORTIMEN, KELOMPOK_JENIS


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

    class Meta:
        table = "rencana_tebang_type"


class KualifikasiGanis(CustomModel):
    nama = fields.CharField(255)

    class Meta:
        table = "kualifikasi_ganis"


class JabatanGanis(CustomModel):
    nama = fields.CharField(255)
    kualifikasi = fields.ForeignKeyField(
        "models.KualifikasiGanis", on_delete=fields.CASCADE
    )

    class Meta:
        table = "jabatan_ganis"


class KelompokJenis(CustomModel):
    nama = fields.CharField(255)

    class Meta:
        table = "kelompok_jenis"


class Jenis(CustomModel):
    nama = fields.CharField(255)
    kelompok_jenis = fields.CharField(255)

    class Meta:
        table = "jenis"


class Sortimen(CustomModel):
    nama = fields.CharField(255)

    class Meta:
        table = "sortimen"


class Tarif(CustomModel):
    nama = fields.CharField(255)
    jenis_tarif = fields.IntField(default=TARIF_TYPE.PSDH.value)
    kelompok_jenis = fields.IntField(default=KELOMPOK_JENIS.KELOMPOK_MERANTI.value)
    sortimen = fields.IntField(default=SORTIMEN.KB.value)
    harga = fields.FloatField(default=0)

    class Meta:
        table = "tarif"
