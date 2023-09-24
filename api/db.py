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
        "account": {
            "models": ["account.models", "aerich.models"],
            "default_connection": "default",
        },
        "umum": {
            "models": ["umum.models"],
            "default_connection": "default",
        },
    },
}


async def init_db(app: FastAPI) -> None:
    await Tortoise.init(
        db_url=DATABASE_URL,
        modules={"account": ["account.models"], "umum": ["umum.models"]},
    )

    print("Tortoise init.....!")
    register_tortoise(
        app,
        db_url=DATABASE_URL,
        modules={"account": ["account.models"], "umum": ["umum.models"]},
        generate_schemas=False,
        add_exception_handlers=True,
    )
