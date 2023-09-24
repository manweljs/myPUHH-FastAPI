from .models import *

# from sqlalchemy.orm import Session
# from sqlalchemy.ext.asyncio import AsyncSession
from .serializers import UserSerializer
import datetime


async def create_user(data):
    defaults = {
        "created": datetime.datetime.utcnow(),
        "modified": datetime.datetime.utcnow(),
        "avatar": None,  # Replace with the appropriate default avatar URL
    }
    user_data = data.dict(exclude_unset=False)
    user_data.update(
        {key: value for key, value in defaults.items() if key not in user_data}
    )

    user = await User.create(**user_data)
    return await UserSerializer.from_tortoise_orm(user)


# async def get_user(id, db) -> User:
#     return db.query(User).filter(User.id == id).first()
