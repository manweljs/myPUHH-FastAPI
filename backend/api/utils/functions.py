from api.account.models import User, Perusahaan
from passlib.context import CryptContext
from datetime import datetime
from urllib.parse import quote, unquote

from api.consts.index import ROLE

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


async def init_app():
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


def generate_unique_filename(original_filename):
    # Mendapatkan waktu saat ini
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    # Pisahkan ekstensi file
    name_part, extension = original_filename.rsplit(".", 1)
    # Gabungkan nama file dengan timestamp dan ekstensi
    unique_filename = f"{name_part}_{timestamp}.{extension}"
    return unique_filename


def encode_url(url):
    return quote(url, safe="/:?&=")


def decode_url(url):
    return unquote(url)
