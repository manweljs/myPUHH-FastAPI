from uuid import uuid4
from tortoise.models import Model
from tortoise import fields
from api.consts import TARIF_TYPE


class CustomModel(Model):
    id = fields.UUIDField(default=uuid4, pk=True, unique=True)
    created = fields.DatetimeField(auto_now_add=True)
    modified = fields.DatetimeField(auto_now=True)

    class Meta:
        abstract = True


class Propinsi(Model):
    nama = fields.CharField(255)


class Kabupaten(Model):
    nama = fields.CharField(255)
    propinsi = fields.ForeignKeyField("models.Propinsi", on_delete=fields.CASCADE)


class RencanaTebangType(Model):
    nama = fields.CharField(255)

    class Meta:
        table = "rencana_tebang_type"


class KualifikasiGanis(Model):
    nama = fields.CharField(255)

    class Meta:
        table = "kualifikasi_ganis"


class JabatanGanis(Model):
    nama = fields.CharField(255)
    kualifikasi = fields.ForeignKeyField(
        "models.KualifikasiGanis", on_delete=fields.CASCADE
    )

    class Meta:
        table = "jabatan_ganis"


class KelompokJenis(Model):
    nama = fields.CharField(255)

    class Meta:
        table = "kelompok_jenis"


class Jenis(Model):
    nama = fields.CharField(255)
    kelompok_jenis = fields.ForeignKeyField(
        "models.KelompokJenis", on_delete=fields.SET_NULL, null=True
    )

    class Meta:
        table = "jenis"


class Sortimen(Model):
    id = fields.IntField(pk=True)
    nama = fields.CharField(255)

    class Meta:
        table = "sortimen"


class Tarif(Model):
    nama = fields.CharField(255)
    jenis_tarif = fields.IntField(default=TARIF_TYPE.PSDH.value)
    kelompok_jenis = fields.ForeignKeyField(
        "models.KelompokJenis", on_delete=fields.SET_NULL, null=True
    )
    sortimen = fields.ForeignKeyField(
        "models.Sortimen", on_delete=fields.SET_NULL, null=True
    )
    harga = fields.FloatField(default=0)

    class Meta:
        table = "tarif"


class KelasDiameter(Model):
    nama = fields.CharField(255)

    class Meta:
        table = "kelas_diameter"


class StatusPohon(Model):
    nama = fields.CharField(255)

    class Meta:
        table = "status_pohon"
