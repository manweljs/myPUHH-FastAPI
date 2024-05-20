from tortoise import fields
from api.umum.models import CustomModel
from api.consts import OBYEK, SORTIMEN, CACAT


class BukuUkur(CustomModel):
    perusahaan = fields.ForeignKeyField("models.Perusahaan", on_delete=fields.CASCADE)
    nomor = fields.CharField(255)
    tanggal = fields.DateField()
    tahun = fields.ForeignKeyField("models.TahunKegiatan", on_delete=fields.CASCADE)

    class Meta:
        table = "buku_ukur"

    def __str__(self) -> str:
        return self.nomor


class DK(CustomModel):
    perusahaan = fields.ForeignKeyField("models.Perusahaan", on_delete=fields.CASCADE)
    buku_ukur = fields.ForeignKeyField("models.BukuUkur", on_delete=fields.CASCADE)
    barcode = fields.ForeignKeyField(
        "models.Barcode", on_delete=fields.SET_NULL, null=True, related_name="dk"
    )
    petak = fields.ForeignKeyField("models.Petak", on_delete=fields.SET_NULL, null=True)
    nomor = fields.IntField()
    panjang = fields.FloatField()
    dp = fields.IntField()
    du = fields.IntField()
    diameter = fields.IntField()
    jenis = fields.ForeignKeyField("models.Jenis", on_delete=fields.CASCADE)
    cacat = fields.IntField(default=CACAT.BAIK.value)
    cacat_cm = fields.IntField(null=True)
    cacat_persen = fields.FloatField(null=True)
    volume = fields.FloatField()
    potongan = fields.CharField(2, null=True)
    sortimen = fields.CharField(3, default=SORTIMEN.KB.value)
    lhp = fields.ForeignKeyField("models.LHP", on_delete=fields.SET_NULL, null=True)

    class Meta:
        table = "DK"

    def __str__(self) -> str:
        return str(self.nomor)


class LHP(CustomModel):
    perusahaan = fields.ForeignKeyField("models.Perusahaan", on_delete=fields.CASCADE)
    tahun = fields.ForeignKeyField("models.TahunKegiatan", on_delete=fields.CASCADE)
    nomor = fields.CharField(255)
    tanggal = fields.DateField()
    obyek = fields.IntField(default=OBYEK.BLOK_PETAK.value)

    class Meta:
        table = "lhp"

    def __str__(self) -> str:
        return self.nomor
