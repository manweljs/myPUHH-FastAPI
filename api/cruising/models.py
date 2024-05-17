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
    lhc = fields.ForeignKeyField("models.LHC", on_delete=fields.CASCADE)
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
    barcode = fields.ForeignKeyField(
        "models.Barcode", on_delete=fields.SET_NULL, null=True
    )

    class Meta:
        table = "pohon"


class RencanaTebang(CustomModel):
    perusahaan = fields.ForeignKeyField("models.Perusahaan", on_delete=fields.CASCADE)
    nomor = fields.CharField(255)
    tahun = fields.ForeignKeyField("models.TahunKegiatan", on_delete=fields.CASCADE)
    obyek = fields.IntField(default=OBYEK.BLOK_PETAK.value)
    tanggal = fields.DateField()
    faktor = fields.FloatField(default=0.7)

    class Meta:
        table = "rencana_tebang"


# data = {
#     "id": UUID("0acbdc26-5496-4cf1-9c2c-3b07c7660027"),
#     "nomor": 20,
#     "jalur": "2",
#     "arah_jalur": "Selatan",
#     "panjang_jalur": 1000,
#     "tinggi": 13.0,
#     "diameter": 20.0,
#     "volume": 0.25,
#     "koordinat_x": 117.01627,
#     "koordinat_y": 1.706563,
#     "barcode_id": None,
#     "jenis_id": 85,
#     "kelas_diameter_id": 1,
#     "sortimen_id": 3,
#     "status_pohon_id": None,
#     "petak_id": UUID("89505736-8c1d-48fb-ac9b-efa3e1a372ba"),
#     "lhc_id": UUID("a8daf43e-af96-455d-8a63-92beb688e1da"),
#     "perusahaan_id": UUID("310363cd-701c-4db9-ab23-73558cd8f4df"),
# }
