from fastapi import FastAPI

from db import init_db
from account.models import *
from tortoise.contrib.fastapi import register_tortoise
from account.routers import router as account_routes


def create_application() -> FastAPI:
    application = FastAPI()
    return application


app = create_application()

app.include_router(account_routes)


@app.on_event("startup")
async def startup_event():
    print("Starting up...")
    await init_db(app)


@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down...")
