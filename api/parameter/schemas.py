from tortoise.contrib.pydantic.base import PydanticModel
from typing import Optional
from uuid import UUID, uuid4
from tortoise.contrib.pydantic import pydantic_model_creator
from . import models

TahunKegiatan = pydantic_model_creator(
    models.TahunKegiatan, name=f"{models.TahunKegiatan.__name__}Schema"
)

TahunKegiatanCreate = pydantic_model_creator(
    models.TahunKegiatan,
    name=f"{models.TahunKegiatan.__name__}SchemaCreate",
    exclude_readonly=True,
)
