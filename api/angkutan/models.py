from tortoise import fields
from umum.models import CustomModel
from consts import ALAT_ANGKUT


class DKBAngkutan(CustomModel):
    perusahaan = fields.ForeignKeyField("models.Perusahaan", on_delete=fields.CASCADE)
    nomor_dkb = fields.CharField(255)
    nomor_dokumen = fields.CharField(255)
    tanggal = fields.DateField()
    tpk_asal = fields.ForeignKeyField(
        "models.TPK", on_delete=fields.CASCADE, related_name="tpk_asal"
    )
    tpk_tujuan = fields.ForeignKeyField(
        "models.TPK", on_delete=fields.CASCADE, related_name="tpk_tujuan"
    )
    alat_angkut = fields.IntField(default=ALAT_ANGKUT.LOGGING_TRUCK.value)
    nama_alat_angkut = fields.CharField(255, null=True)
    dokumen_url = fields.TextField(null=True)
    barcodes = fields.ManyToManyField(
        "models.Barcode", related_name="dkb_angkutan", through="DKBBarcode"
    )

    class Meta:
        table = "dkb_angkutan"


class DKBBarcode(CustomModel):
    dkb = fields.ForeignKeyField("models.DKBAngkutan", on_delete=fields.CASCADE)
    barcode = fields.ForeignKeyField("models.Barcode", on_delete=fields.CASCADE)

    class Meta:
        table = "dkb_barcode"
