from tortoise import fields
from api.umum.models import CustomModel
from api.consts import KATEGORI_TPK


class TahunKegiatan(CustomModel):
    tahun = fields.IntField()
    perusahaan = fields.ForeignKeyField("models.Perusahaan", on_delete=fields.CASCADE)
    tanggal_mulai = fields.DateField(null=True)
    tanggal_selesai = fields.DateField(null=True)

    class Meta:
        table = "tahun_kegiatan"

    def __str__(self):
        return self.tahun


class TPK(CustomModel):
    nama = fields.CharField(255)
    perusahaan = fields.ForeignKeyField("models.Perusahaan", on_delete=fields.CASCADE)
    kategori = fields.IntField(default=KATEGORI_TPK.TPK_HUTAN.value)
    alamat = fields.CharField(255, null=True)

    class Meta:
        table = "tpk"

    def __str__(self):
        return self.nama


class TPn(CustomModel):
    nama = fields.CharField(255)
    blok = fields.ForeignKeyField("models.Blok", on_delete=fields.SET_NULL, null=True)
    perusahaan = fields.ForeignKeyField("models.Perusahaan", on_delete=fields.CASCADE)

    class Meta:
        table = "tpn"

    def __str__(self):
        return self.nama


class Blok(CustomModel):
    nama = fields.CharField(255)
    tahun = fields.ForeignKeyField("models.TahunKegiatan", on_delete=fields.CASCADE)
    perusahaan = fields.ForeignKeyField("models.Perusahaan", on_delete=fields.CASCADE)

    class Meta:
        table = "blok"

    def __str__(self):
        return self.nama


class Petak(CustomModel):
    nama = fields.CharField(255)
    blok = fields.ForeignKeyField("models.Blok", on_delete=fields.CASCADE)
    luas = fields.FloatField(default=0)
    perusahaan = fields.ForeignKeyField("models.Perusahaan", on_delete=fields.CASCADE)

    class Meta:
        table = "petak"

    def __str__(self):
        return self.nama


class Ganis(CustomModel):
    nama = fields.CharField(255)
    perusahaan = fields.ForeignKeyField("models.Perusahaan", on_delete=fields.CASCADE)
    jabatan = fields.ForeignKeyField("models.JabatanGanis", on_delete=fields.CASCADE)
    berlaku_dari = fields.DateField(null=True)
    berlaku_sampai = fields.DateField(null=True)

    class Meta:
        table = "ganis"

    def __str__(self):
        return self.nama


class PerusahaanPembeli(CustomModel):
    nama = fields.CharField(255)
    alamat = fields.CharField(255, null=True)
    kabupaten = fields.ForeignKeyField(
        "models.Kabupaten", on_delete=fields.SET_NULL, null=True
    )

    class Meta:
        table = "perusahaan_pembeli"

    def __str__(self):
        return self.nama
