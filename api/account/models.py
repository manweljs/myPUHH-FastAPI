from tortoise import fields
from umum.models import CustomModel
from consts import ROLE


class User(CustomModel):
    username = fields.CharField(max_length=50, unique=True)
    first_name = fields.CharField(max_length=50)
    last_name = fields.CharField(max_length=50)
    password = fields.TextField()
    email = fields.CharField(max_length=255, unique=True)
    avatar = fields.TextField(null=True)
    is_active = fields.BooleanField(default=False)
    perusahaan = fields.ForeignKeyField(
        "models.Perusahaan", on_delete=fields.SET_NULL, null=True
    )
    role = fields.CharField(max_length=50, default=ROLE.OPERATOR)

    class Meta:
        table = "users"

    def __str__(self):
        return self.username


class Perusahaan(CustomModel):
    nama = fields.CharField(255)
    kabupaten = fields.ForeignKeyField(
        "models.Kabupaten", on_delete=fields.SET_NULL, null=True
    )
    alamat = fields.TextField(null=True)
    logo = fields.TextField(null=True)


class Operator(CustomModel):
    user = fields.ForeignKeyField("models.User", on_delete=fields.CASCADE)
    perusahaan = fields.ForeignKeyField("models.Perusahaan", on_delete=fields.CASCADE)
    nama = fields.CharField(255)

    class Meta:
        table = "operator"


class Token(CustomModel):
    access_token = fields.TextField()
    token_type = fields.TextField()

    class Meta:
        table = "tokens"
