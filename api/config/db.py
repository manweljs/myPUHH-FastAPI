import os
from dotenv import load_dotenv
from tortoise.contrib.fastapi import register_tortoise
from tortoise import Tortoise
from fastapi import FastAPI
import urllib.parse

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
ENCODED_PASSWORD = urllib.parse.quote(DB_PASSWORD)
DATABASE_URL = f"postgres://{DB_USER}:{ENCODED_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"


model_list = [
    "aerich.models",
    "account.models",
    "umum.models",
    "parameter.models",
    "cruising.models",
    "produksi.models",
    "angkutan.models",
    "spreadsheet.models",
]


tortoise_config = {
    "connections": {"default": DATABASE_URL},
    "apps": {
        "models": {
            "models": model_list,
            "default_connection": "default",
        },
    },
}


async def init_db(app: FastAPI) -> None:
    await Tortoise.init(config=tortoise_config)

    # Opsi untuk generate schema jika diperlukan
    # await Tortoise.generate_schemas()

    register_tortoise(
        app,
        config=tortoise_config,
        add_exception_handlers=True,
    )

    print("Tortoise ORM initialized!")
