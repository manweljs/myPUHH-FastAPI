from fastapi import APIRouter
from api.consts import ROLE
from api.account.models import User, Perusahaan
from api.umum.models import (
    Propinsi,
    Kabupaten,
    KelompokJenis,
    Jenis,
    RencanaTebangType,
    Sortimen,
    KualifikasiGanis,
    JabatanGanis,
    KelasDiameter,
)
from passlib.context import CryptContext
import aiofiles
import pandas as pd
from tortoise.transactions import in_transaction
from tortoise.contrib.pydantic import pydantic_model_creator
import os


# Inisialisasi objek CryptContext dengan algoritma bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

email = "admin@mypuhh.com"
username = "admin"
first_name = "Admin"
last_name = "Admin"
password = "123"
is_superuser = True
role = ROLE.ADMIN.value


file_path = "api/utils/files"
# full_path = os.path.abspath(os.path.join(file_path, "propinsi.xlsx"))
# print("Full path:", full_path)


nama_perusahaan = "PT. Mardhika Insan Mulia"

router = APIRouter(prefix="/initapp")


@router.post("/", tags=["default"], include_in_schema=True)
async def init_app(params: str):

    if params != "123":
        return {"message": "Invalid parameter"}

    async with in_transaction() as connection:
        await init_user(connection)
        await init_propinsi(connection)
        await init_kabupaten(connection)
        await init_kelompok_jenis(connection)
        await init_jenis(connection)
        await init_rencana_tebang_type(connection)
        await init_sortimen(connection)
        await init_kualifikasi_ganis(connection)
        await init_kelas_diameter(connection)

    return {"message": "App initialized!"}


async def init_propinsi(connection):
    Propinsi.all().delete()
    async with aiofiles.open(file_path + "/propinsi.xlsx", mode="rb") as file:
        df = pd.read_excel(await file.read())
        for index, row in df.iterrows():
            if not await Propinsi.exists(nama=row["Propinsi"]):
                await Propinsi.create(nama=row["Propinsi"], using_db=connection)


async def init_kabupaten(connection):
    Kabupaten.all().delete()
    async with aiofiles.open(file_path + "/kabupatenkota.xlsx", mode="rb") as file:
        df = pd.read_excel(await file.read())
        for index, row in df.iterrows():
            propinsi = await Propinsi.get(nama=row["Propinsi"])
            if not await Kabupaten.exists(nama=row["Kabupaten"]):
                await Kabupaten.create(
                    nama=row["Kabupaten"], propinsi=propinsi, using_db=connection
                )


async def init_kelompok_jenis(connection):
    KelompokJenis.all().delete()
    async with aiofiles.open(
        file_path + "/tabel_kelompok_jenis.xlsx", mode="rb"
    ) as file:
        df = pd.read_excel(await file.read())
        for index, row in df.iterrows():
            if not await KelompokJenis.exists(nama=row["kelompok_jenis"]):
                await KelompokJenis.create(
                    nama=row["kelompok_jenis"], using_db=connection
                )


async def init_jenis(connection):
    await Jenis.all().delete()  # Pastikan perintah ini benar-benar menghapus data
    async with aiofiles.open(file_path + "/tabel_jenis.xlsx", mode="rb") as file:
        df = pd.read_excel(await file.read())
        for index, row in df.iterrows():
            kelompok_jenis = await KelompokJenis.get(nama=row["kelompok_jenis"])
            existing = await Jenis.exists(nama=row["jenis"])
            if not existing:
                jenis = await Jenis.create(
                    nama=row["jenis"],
                    kelompok_jenis=kelompok_jenis,
                    using_db=connection,
                )
            else:
                print(f"Jenis already exists: {row['jenis']}")


async def init_user(connection):
    Perusahaan.all().delete()
    User.filter(username=username).delete()

    perusahaan = await Perusahaan.create(nama=nama_perusahaan)
    hashed_password = pwd_context.hash(password)
    await User.create(
        email=email,
        username=username,
        first_name=first_name,
        last_name=last_name,
        password=hashed_password,
        is_superuser=is_superuser,
        role=role,
        perusahaan=perusahaan,
        using_db=connection,
    )


async def init_rencana_tebang_type(connection):
    RencanaTebangType.all().delete()
    data = ["Blok / Petak", "Trase Jalan"]

    for item in data:
        if not await RencanaTebangType.exists(nama=item):
            await RencanaTebangType.create(nama=item, using_db=connection)


async def init_sortimen(connection):
    Sortimen.all().delete()
    data = [
        "KB",
        "KBS",
        "KBK",
    ]

    for item in data:
        if not await Sortimen.exists(nama=item):
            await Sortimen.create(nama=item, using_db=connection)


async def init_kualifikasi_ganis(connection):
    kualifikasi = ["PKB", "CANHUT"]
    pkb = ["P3KB", "Penerbit SKSHHK", "Pembuat LHP"]
    canhut = ["Pembuat LHC"]

    for item in kualifikasi:
        if not await KualifikasiGanis.exists(nama=item):
            await KualifikasiGanis.create(nama=item, using_db=connection)

    for item in pkb:
        qualify = await KualifikasiGanis.get(nama="PKB")
        if not await JabatanGanis.exists(nama=item):
            await JabatanGanis.create(
                nama=item, kualifikasi=qualify, using_db=connection
            )

    for item in canhut:
        qualify = await KualifikasiGanis.get(nama="CANHUT")
        if not await JabatanGanis.exists(nama=item):
            await JabatanGanis.create(
                nama=item, kualifikasi=qualify, using_db=connection
            )


async def init_kelas_diameter(connection):
    KelasDiameter.all().delete()
    data = [
        "10-29",
        "30-39",
        "40-49",
        "50Up",
    ]

    for item in data:
        if not await KelasDiameter.exists(nama=item):
            await KelasDiameter.create(nama=item, using_db=connection)
