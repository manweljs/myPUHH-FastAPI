from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from typing import Any


class ResponseError(HTTPException):
    def __init__(self, status_code: int, detail: Any = None):
        super().__init__(status_code=status_code, detail=detail)
