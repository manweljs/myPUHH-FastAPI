from fastapi import FastAPI
from db import init_db
from account.views import router as account_routes
from parameter.views import router as parameter_routes
from umum.views import router as umum_routes
from cruising.views import router as cruising_routes


def create_application() -> FastAPI:
    application = FastAPI(
        title="myPUHH API",
        swagger_ui_parameters={"persistAuthorization": True, "docExpansion": "none"},
    )
    return application


app = create_application()

app.include_router(account_routes)
app.include_router(parameter_routes)
app.include_router(umum_routes)
app.include_router(cruising_routes)


@app.on_event("startup")
async def startup_event():
    print("Starting up...")
    await init_db(app)


@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down...")
