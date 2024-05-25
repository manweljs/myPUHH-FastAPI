from uuid import UUID
from parameter.schemas import PetakSchema
from parameter.models import Petak
from utils.serializers import BaseSerializer


class PetakSerializer(BaseSerializer):
    class Meta:
        model = Petak
        schema = PetakSchema

    async def get_blok(self, instance: Petak) -> str:
        blok = instance.blok.nama
        return blok

    async def get_blok_id(self, instance: Petak) -> UUID:
        blok_id = instance.blok.id
        return blok_id

    async def get_tahun(self, instance: Petak) -> int:
        tahun = instance.blok.tahun.tahun
        return tahun
