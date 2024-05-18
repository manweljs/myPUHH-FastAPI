from typing import Type, Generic, TypeVar, Union, List, Dict, Any, Callable
import asyncio
import inspect

T = TypeVar("T")  # Generic type for model
U = TypeVar("U")  # Generic type for schema


class BaseSerializer(Generic[T, U]):
    def __init__(self, queryset: Union[T, List[T]], many: bool = False):
        self.queryset = queryset
        self.many = many

    async def serialize(self):
        data = self.process_queryset()
        return await self.add_custom_fields(data)  # Pastikan menggunakan await di sini

    def process_queryset(self) -> Union[List[Dict[str, Any]], Dict[str, Any]]:
        if isinstance(self.queryset, list):
            if self.many:
                return [obj.__dict__ for obj in self.queryset]
            else:
                return self.queryset[0].__dict__ if self.queryset else None
        else:
            return self.queryset.__dict__

    async def add_custom_fields(self, data):
        if isinstance(data, list):
            return [
                self.Meta.schema(
                    **{**item, **(await self.call_get_methods(obj))}
                ).dict()
                for item, obj in zip(data, self.queryset)
            ]
        else:
            return self.Meta.schema(
                **{**data, **(await self.call_get_methods(self.queryset))}
            ).dict()

    async def call_get_methods(self, instance=None):
        custom_fields = {}
        method_tasks = []
        methods = {}
        for attr in dir(self):
            if callable(getattr(self, attr)) and attr.startswith("get_"):
                method = getattr(self, attr)
                # Check if 'method' expects an 'instance' argument
                if "instance" in inspect.signature(method).parameters:
                    # If it does, call it with 'instance'
                    if asyncio.iscoroutinefunction(method):
                        task = asyncio.ensure_future(method(instance))
                        method_tasks.append(task)
                        methods[task] = attr[4:]
                    else:
                        custom_fields[attr[4:]] = method(instance)
                else:
                    # If it doesn't, call it without 'instance'
                    if asyncio.iscoroutinefunction(method):
                        task = asyncio.ensure_future(method())
                        method_tasks.append(task)
                        methods[task] = attr[4:]
                    else:
                        custom_fields[attr[4:]] = method()

        await asyncio.gather(*method_tasks)
        for task in method_tasks:
            custom_fields[methods[task]] = task.result()

        return custom_fields

    class Meta:
        model: Type[T]
        schema: Type[U]
