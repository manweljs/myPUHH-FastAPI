from fastapi import APIRouter
from consts import ROLE
from account.models import User, Perusahaan
from passlib.context import CryptContext

# Inisialisasi objek CryptContext dengan algoritma bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

email = "admin@mypuhh.com"
username = "admin"
first_name = "Admin"
last_name = "Admin"
password = "123"
is_superuser = True
role = ROLE.ADMIN.value

nama_perusahaan = "PT. Mardhika Insan Mulia"

router = APIRouter(prefix="/initapp")


@router.post("/", tags=["default"], include_in_schema=False)
async def init_app(params: str):

    if params != "123":
        return {"message": "Invalid parameter"}

    perusahaan = await Perusahaan.create(nama=nama_perusahaan)
    hashed_password = pwd_context.hash(password)
    user = await User.create(
        email=email,
        username=username,
        first_name=first_name,
        last_name=last_name,
        password=hashed_password,
        is_superuser=is_superuser,
        role=role,
        perusahaan=perusahaan,
    )

    return {"message": "App initialized!"}
