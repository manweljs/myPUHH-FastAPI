from fastapi import FastAPI
from config.db import init_db
from account.views import router as account_routes
from parameter.views import router as parameter_routes
from umum.views import router as umum_routes
from cruising.views import router as cruising_routes
from angkutan.views import router as angkutan_routes
from produksi.views import router as produksi_routes
from utils.initialize import router as init_app


def create_application() -> FastAPI:
    application = FastAPI(
        docs_url="/",
        title="myPUHH API",
        swagger_ui_parameters={"persistAuthorization": True, "docExpansion": "none"},
    )
    return application


app = create_application()

app.include_router(account_routes)
app.include_router(parameter_routes)
app.include_router(umum_routes)
app.include_router(cruising_routes)
app.include_router(angkutan_routes)
app.include_router(produksi_routes)
app.include_router(init_app)


@app.on_event("startup")
async def startup_event():
    print("Starting up...")
    await init_db(app)


@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down...")
