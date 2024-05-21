from math import e
from fastapi import FastAPI, Request
from starlette.exceptions import HTTPException
from fastapi.responses import JSONResponse
from utils.functions import clean_error_message
from utils.exceptions import ResponseError
from config.db import init_db
from account.views import router as account_routes
from parameter.views import router as parameter_routes
from umum.views import router as umum_routes
from cruising.views import router as cruising_routes
from angkutan.views import router as angkutan_routes
from produksi.views import router as produksi_routes
from spreadsheet.views import router as spreadsheet_routes
from utils.initialize import router as init_app
from fastapi_pagination import add_pagination
from fastapi.middleware.cors import CORSMiddleware
from consts import allowed_cors_origins
import uvicorn
import logging


def create_application() -> FastAPI:
    application = FastAPI(
        docs_url="/",
        title="myPUHH API",
        swagger_ui_parameters={"persistAuthorization": True, "docExpansion": "none"},
    )

    return application


app = create_application()

add_pagination(app)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):

    response_content = {
        "success": False,
        "status_code": exc.status_code,
        "details": clean_error_message(exc.detail),
    }
    return JSONResponse(
        status_code=exc.status_code,
        content=response_content,
    )


@app.middleware("http")
async def log_requests(request, call_next):
    try:
        response = await call_next(request)
    except Exception as e:
        logging.exception("Unhandled error: %s", e)
        raise e
    return response


app.include_router(account_routes)
app.include_router(parameter_routes)
app.include_router(umum_routes)
app.include_router(cruising_routes)
app.include_router(angkutan_routes)
app.include_router(produksi_routes)
app.include_router(spreadsheet_routes)
app.include_router(init_app)


@app.on_event("startup")
async def startup_event():
    print("Starting up...")
    await init_db(app)
    print("Database initialized...")


@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down...")


def start():
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)


if __name__ == "__main__":
    start()
