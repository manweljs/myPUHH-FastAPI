from fastapi import APIRouter, status, Depends
from . import schema
from .serializers import UserInSerializer, UserSerializer
from .models import *
from . import views
import datetime
from utils.tokens import get_current_user
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from utils.tokens import create_access_token
from account.views import authenticate_user
from datetime import timedelta

# from conf.database import get_db


router = APIRouter(tags=["Account"], prefix="/api/Account")


@router.post(
    "/Register", status_code=status.HTTP_201_CREATED, response_model=schema.User
)
async def post(data: schema.CreateUser):
    return await views.create_user(data)


@router.get("/User", status_code=status.HTTP_200_OK, response_model=schema.User)
async def get(user: User = Depends(get_current_user)):
    print(user)
    return await views.get_user(user)


@router.post(
    "/Login", status_code=status.HTTP_200_OK, response_model=schema.LoginResponse
)
async def login(data: schema.LoginUser):
    return await views.login(data)


@router.post("/Token")
async def token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}
