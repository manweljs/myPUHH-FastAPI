from fastapi import Query
from typing import Generic, TypeVar
from fastapi_pagination import Page, Params


# Definisi Params Kustom
class CustomParams(Params):
    size: int = Query(100, ge=1, le=5000, description="Number of items per page")
    page: int = Query(1, ge=1, description="Page number")


# Definisi Custom Page
T = TypeVar("T")


class CustomPage(Page[T], Generic[T]):
    __params_type__ = CustomParams
