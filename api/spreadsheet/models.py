from tortoise import fields
from umum.models import CustomModel


class SpreadsheetDraft(CustomModel):
    perusahaan = fields.ForeignKeyField("models.Perusahaan", on_delete=fields.CASCADE)
    title = fields.CharField(255)
    object = fields.CharField(255)
    object_id = fields.UUIDField()
    file_url = fields.TextField()
    version = fields.IntField(default=1)

    class Meta:
        table = "spreadsheet_draft"

    def __str__(self) -> str:
        return self.title
