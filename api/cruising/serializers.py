from typing import Union
from fastapi import HTTPException
from pydantic import TypeAdapter
from tortoise.functions import Sum, Count
from .schemas import LHCSchema
from tortoise.models import Model
from tortoise.queryset import QuerySet


class LHCSerializer:
    def __init__(self, lhc_query: QuerySet, many: bool = False):
        self.lhc_query = lhc_query
        self.many = many

    async def serialize(self):
        if isinstance(self.lhc_query, QuerySet):
            if self.many:
                lhc_list = (
                    await self.lhc_query.prefetch_related("tahun")
                    .annotate(
                        total_pohon=Count("pohons"), total_volume=Sum("pohons__volume")
                    )
                    .order_by("id")
                    .all()
                )
            else:
                lhc_list = (
                    await self.lhc_query.prefetch_related("tahun")
                    .annotate(
                        total_pohon=Count("pohons"), total_volume=Sum("pohons__volume")
                    )
                    .order_by("id")
                    .all()
                )

        lhc_results = []

        for lhc in lhc_list:
            lhc_dict = {
                **lhc.__dict__,
                "total_pohon": lhc.total_pohon,
                "total_volume": lhc.total_volume,
                "tahun": (lhc.tahun.__dict__ if lhc.tahun else None),
            }

            lhc_data = TypeAdapter(LHCSchema).validate_python(lhc_dict)
            lhc_results.append(lhc_data)

        if self.many:
            return lhc_results
        return lhc_results[0]
