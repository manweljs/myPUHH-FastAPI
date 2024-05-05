import os
from dotenv import load_dotenv
from tortoise.contrib.fastapi import register_tortoise
from tortoise import Tortoise
from fastapi import FastAPI

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = f"postgres://{DB_USER}:{DB_PASSWORD}@host.docker.internal:5432/{DB_NAME}"

tortoise_config = {
    "connections": {"default": DATABASE_URL},
    "apps": {
        "models": {
            "models": [
                "account.models",
                "umum.models",
                "parameter.models",
                "cruising.models",
                "produksi.models",
                "angkutan.models",
                "aerich.models",
            ],
            "default_connection": "default",
        },
    },
}


async def init_db(app: FastAPI) -> None:
    await Tortoise.init(
        config=tortoise_config
    )  # Inisialisasi menggunakan konfigurasi yang Anda definisikan
    await Tortoise.generate_schemas()  # Opsi untuk generate schema jika diperlukan

    register_tortoise(
        app,
        config=tortoise_config,
        add_exception_handlers=True,
    )

    print("Tortoise ORM initialized!")
