from pydantic import BaseModel
from sqlalchemy import Column
from sqlalchemy.types import String, Integer
from sqlalchemy.ext.declarative import declarative_base


# class BaseSerializer:
#     def __init__(self, instance=None, **kwargs):
#         self.instance = instance
#         self.fields = self._get_fields()

#     def _get_fields(self):
#         fields = {}
#         for attr in dir(self):
#             if not attr.startswith("_") and not callable(getattr(self, attr)):
#                 fields[attr] = getattr(self, attr)
#         return fields

#     def to_pydantic(self):
#         return type(self.__class__.__name__ + "Schema", (BaseModel,), self.fields)


from typing import ClassVar
from pydantic import BaseModel


from pydantic import BaseModel, UUID4
from sqlalchemy import String, Integer, UUID, Column


class BaseSerializer(BaseModel):
    def __init__(self, instance=None, **kwargs):
        self.to_pydantic()

    def to_pydantic(self):
        model = self.get_model()
        fields = {}

        for attr_name in dir(model):
            if not attr_name.startswith("_"):
                attr = getattr(model, attr_name)

                if isinstance(attr, Column):
                    sqlalchemy_type = attr.type
                    pydantic_type = get_pydantic_type(sqlalchemy_type)
                    fields[attr_name] = (pydantic_type,)

        schema = type(self.__class__.__name__ + "Schema", (BaseModel,), fields)
        print("schema ----------->", schema)
        return schema

    @classmethod
    def get_model(cls):
        return getattr(cls.Meta, "model", None)  # type: ignore


def get_pydantic_type(sqlalchemy_type):
    # Map SQLAlchemy types to Pydantic types
    sqlalchemy_to_pydantic = {
        String: str,
        Integer: int,
        UUID: UUID4  # Assuming you want to convert UUID to a string
        # Add more mappings for other SQLAlchemy types as needed
    }

    return sqlalchemy_to_pydantic.get(sqlalchemy_type, str)
