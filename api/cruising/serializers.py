from typing import List, Union
from uuid import UUID
from fastapi import HTTPException
from pydantic import TypeAdapter
from tortoise.functions import Sum, Count

from parameter.models import TahunKegiatan
from utils.serializers import BaseSerializer
from .schemas import LHCBaseSchema, LHCSchema, RencanaTebangSchema
from tortoise.models import Model
from tortoise.queryset import QuerySet
from .models import LHC, RencanaTebang


class LHCSerializer(BaseSerializer):
    class Meta:
        model = LHC
        schema = LHCBaseSchema

    async def get_tahun(self, instance: LHC) -> int:
        tahun = instance.tahun.tahun
        return tahun

    async def get_tahun_id(self, instance: LHC) -> UUID:
        tahun_id = instance.tahun.id
        return tahun_id

    async def get_blok(self, instance: LHC) -> str:
        try:
            blok = instance.blok.nama
        except:
            blok = None
        return blok


class RencanaTebangSerializer(BaseSerializer):
    class Meta:
        model = RencanaTebang
        schema = RencanaTebangSchema

    async def get_tahun(self, instance: RencanaTebang) -> int:
        tahun = instance.tahun.tahun
        return tahun

    async def get_tahun_id(self, instance: RencanaTebang) -> UUID:
        tahun_id = instance.tahun_id
        return tahun_id

    async def get_jenis(self, instance: RencanaTebang) -> List[int]:
        # Membuat query untuk mengambil entri yang terkait dan memetakan ke ID mereka
        jenis_ids = await instance.jenis.all().values_list("nama", flat=True)
        return jenis_ids

    async def get_jenis_ids(self, instance: RencanaTebang) -> List[int]:
        # Membuat query untuk mengambil entri yang terkait dan memetakan ke ID mereka
        jenis_ids = await instance.jenis.all().values_list("id", flat=True)
        return jenis_ids

    async def get_bloks(self, instance: RencanaTebang) -> str:
        bloks = await instance.blok.all().values_list("nama", flat=True)
        return bloks

    async def get_blok_ids(self, instance: RencanaTebang) -> List[UUID]:
        blok_ids = await instance.blok.all().values_list("id", flat=True)
        return blok_ids
