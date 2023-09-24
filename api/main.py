from fastapi import FastAPI

from conf.database import DATABASE_URL
from account.models import *
from tortoise.contrib.fastapi import register_tortoise

from account.routers import router as account_routes


app = FastAPI()
app.include_router(account_routes)


@app.get("/")
async def home():
    result = {"status": True}
    return result


@app.get("/User")
async def get_user(pk: str):
    result = {"status": True}
    return result


register_tortoise(
    app,
    db_url=DATABASE_URL,
    modules={"account": ["account.models"], "umum": ["umum.models"]},
    generate_schemas=True,
    add_exception_handlers=True,
)
