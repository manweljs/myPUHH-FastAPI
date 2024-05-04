from tortoise.contrib.pydantic.base import PydanticModel
from typing import Optional
from uuid import UUID, uuid4
from tortoise.contrib.pydantic import pydantic_model_creator
from . import models


class Response(PydanticModel):
    success: bool = True
    message: Optional[str] = None
