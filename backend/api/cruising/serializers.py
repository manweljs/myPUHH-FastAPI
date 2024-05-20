from typing import Union
from fastapi import HTTPException
from pydantic import TypeAdapter
from tortoise.functions import Sum, Count

from api.parameter.models import TahunKegiatan
from api.utils.serializers import BaseSerializer
from .schemas import LHCBaseSchema, LHCSchema
from tortoise.models import Model
from tortoise.queryset import QuerySet
from .models import LHC


class LHCSerializer(BaseSerializer):
    class Meta:
        model = LHC
        schema = LHCBaseSchema

    async def get_tahun(self, instance: LHC) -> dict:
        tahun = instance.tahun.tahun
        return tahun
