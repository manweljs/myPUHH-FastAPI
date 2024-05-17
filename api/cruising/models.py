from tortoise import fields
from tortoise.exceptions import IntegrityError
from umum.models import CustomModel
from consts import OBYEK, SORTIMEN


class LHC(CustomModel):
    perusahaan = fields.ForeignKeyField("models.Perusahaan", on_delete=fields.CASCADE)
    nomor = fields.CharField(255)
    tahun = fields.ForeignKeyField("models.TahunKegiatan", on_delete=fields.CASCADE)
    tanggal = fields.DateField()
    obyek = fields.IntField(default=OBYEK.BLOK_PETAK.value)
    barcode = fields.ReverseRelation["Barcode"]

    class Meta:
        table = "lhc"

    class PydanticMeta:
        exclude = ("perusahaan", "tahun")

    async def save(self, *args, **kwargs):
        existing_entry = (
            await LHC.filter(nomor=self.nomor, tahun_id=self.tahun_id)
            .exclude(id=self.pk)
            .first()
        )

        if existing_entry:
            raise IntegrityError(f"Kombinasi nomor dan tahun sudah ada.")
        await super().save(*args, **kwargs)

    async def validate_unique(self, id):
        existing_entry = (
            await LHC.filter(nomor=self.nomor, tahun_id=self.tahun_id)
            .exclude(id=id)
            .exists()
        )
        if existing_entry:
            raise IntegrityError("Kombinasi nomor dan tahun sudah ada.")


class Barcode(CustomModel):
    perusahaan = fields.ForeignKeyField("models.Perusahaan", on_delete=fields.CASCADE)
    barcode = fields.CharField(255, unique=True)
    lhc = fields.ForeignKeyField(
        "models.LHC", on_delete=fields.CASCADE, related_name="barcode"
    )
    rencana_tebang = fields.ForeignKeyField(
        "models.RencanaTebang", on_delete=fields.SET_NULL, null=True
    )
    lhp = fields.ForeignKeyField("models.LHP", on_delete=fields.SET_NULL, null=True)
    lokasi = fields.ForeignKeyField("models.TPK", on_delete=fields.SET_NULL, null=True)
    mutasi = fields.ManyToManyField(
        "models.DKBAngkutan", related_name="barcode", through="DKBBarcode"
    )
    is_industri = fields.BooleanField(default=False)
    perusahaan_pembeli = fields.ForeignKeyField(
        "models.PerusahaanPembeli", on_delete=fields.SET_NULL, null=True
    )

    class Meta:
        table = "barcode"

    class PydanticMeta:
        include = (
            "barcode",
            "id",
        )


class Pohon(CustomModel):
    perusahaan = fields.ForeignKeyField("models.Perusahaan", on_delete=fields.CASCADE)
    nomor = fields.IntField()
    petak = fields.ForeignKeyField("models.Petak", on_delete=fields.CASCADE)
    jalur = fields.CharField(255, null=True)
    arah_jalur = fields.CharField(255, null=True)
    panjang_jalur = fields.IntField(null=True)
    jenis = fields.ForeignKeyField("models.Jenis", on_delete=fields.CASCADE)
    tinggi = fields.FloatField()
    diameter = fields.FloatField()
    volume = fields.FloatField()
    kelas_diameter = fields.ForeignKeyField(
        "models.KelasDiameter", on_delete=fields.SET_NULL, null=True
    )
    sortimen = fields.ForeignKeyField(
        "models.Sortimen", on_delete=fields.SET_NULL, null=True
    )
    status_pohon = fields.ForeignKeyField(
        "models.StatusPohon", on_delete=fields.SET_NULL, null=True
    )
    koordinat_x = fields.FloatField(null=True)
    koordinat_y = fields.FloatField(null=True)
    barcode = fields.ReverseRelation["BarcodePohon"]

    class Meta:
        table = "pohon"


class BarcodePohon(CustomModel):
    barcode = fields.ForeignKeyField(
        "models.Barcode", on_delete=fields.CASCADE, related_name="barcode_pohon"
    )
    pohon = fields.ForeignKeyField(
        "models.Pohon", on_delete=fields.CASCADE, related_name="barcode_pohon"
    )

    class Meta:
        table = "barcode_pohon"


class RencanaTebang(CustomModel):
    perusahaan = fields.ForeignKeyField("models.Perusahaan", on_delete=fields.CASCADE)
    nomor = fields.CharField(255)
    tahun = fields.ForeignKeyField("models.TahunKegiatan", on_delete=fields.CASCADE)
    obyek = fields.IntField(default=OBYEK.BLOK_PETAK.value)
    tanggal = fields.DateField()
    faktor = fields.FloatField(default=0.7)

    class Meta:
        table = "rencana_tebang"
