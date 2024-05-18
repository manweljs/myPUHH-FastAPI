from utils.decorators import timing_decorator
from utils.serializers import BaseSerializer

from umum.models import JabatanGanis, Jenis, Kabupaten, Propinsi
from umum.schemas import (
    JabatanGanisSchema,
    JenisSchema,
    KabupatenSchema,
    PropinsiSchema,
)


class PropinsiSerializer(BaseSerializer):
    class Meta:
        model = Propinsi
        schema = PropinsiSchema

    def get_test(self) -> str:
        return True


class KabupatenSerializer(BaseSerializer):
    class Meta:
        model = Kabupaten
        schema = KabupatenSchema

    async def get_propinsi(self, instance) -> str:
        return instance.propinsi.nama

    def get_propinsi_id(self, instance) -> int:
        return instance.propinsi.id


class JabatanGanisSerializer(BaseSerializer):
    class Meta:
        model = JabatanGanis
        schema = JabatanGanisSchema

    async def get_kualifikasi(self, instance) -> str:
        return instance.kualifikasi.nama


class JenisSerializer(BaseSerializer):
    class Meta:
        model = Jenis
        schema = JenisSchema

    async def get_kelompok_jenis(self, instance) -> str:
        return instance.kelompok_jenis.nama

    async def get_kelompok_jenis_id(self, instance) -> int:
        return instance.kelompok_jenis.id
