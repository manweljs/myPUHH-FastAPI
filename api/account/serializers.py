from pydantic import BaseModel
from typing import Optional
from uuid import UUID, uuid4
from enum import Enum
import datetime

from .models import User

from tortoise.contrib.pydantic import pydantic_model_creator

UserInSerializer = pydantic_model_creator(User, name="UserIn", exclude_readonly=True)
UserSerializer = pydantic_model_creator(User, name="User")
