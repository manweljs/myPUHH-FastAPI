from fastapi import FastAPI
from account.schema import UserSchema

from conf.database import session, engine
from account.models import *

app = FastAPI()


@app.get("/")
async def home():
    result = {"status": True}
    return result


@app.get("/User")
async def get_user(pk: str):
    result = {"status": True}
    return result


@app.post("/users/")
async def create_user(data: UserSchema):
    print(data)

    # print("data----------------->", data)
    new_user = User(
        id=data.id,
        username=data.username,
        first_name=data.first_name,
        last_name=data.last_name,
        password=data.password,
        email=data.email,
        avatar=data.avatar,
    )
    # serializer =
    session.add(new_user)
    session.commit()
    result = {"status": True, "data": data.dict()}
    return result


@app.post("/manage/create_tables")
async def create_tables():
    # Add any new models you want to create tables for
    print(Base)
    Base.metadata.create_all(engine)
    return {"message": "Tables created successfully"}
