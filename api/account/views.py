from .models import User, Perusahaan
from . import schemas
from fastapi import HTTPException, status, APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Optional, List
import datetime
from passlib.context import CryptContext
from utils.tokens import create_access_token, get_current_user

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(tags=["Account"], prefix="/api/Account")


class Hash:
    def bcript(password):
        return pwd_context.hash(password)

    def verify(plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)


async def authenticate_user(username, password):
    user = await User.get_or_none(username=username)
    if not user:
        return False
    if not Hash.verify(password, user.password):
        return False
    return user


@router.post(
    "/Register", status_code=status.HTTP_201_CREATED, response_model=schemas.User
)
async def create_user(data: schemas.CreateUser):
    password_hash = pwd_context.hash(data.password)
    user_data = data.model_dump(exclude_unset=True)
    user_data["password"] = password_hash
    try:
        user = await User.create(**user_data)
    except Exception as e:
        error_detail = str(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=error_detail
        )

    return await user


@router.get("/User", status_code=status.HTTP_200_OK, response_model=schemas.User)
async def get_user(user: User = Depends(get_current_user)):
    return await user


@router.post(
    "/Login", status_code=status.HTTP_200_OK, response_model=schemas.LoginResponse
)
async def login(data: schemas.LoginUser):
    user = await User.get_or_none(username=data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    if not Hash.verify(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User not found"
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post(
    "/Token",
    status_code=status.HTTP_200_OK,
    response_model=schemas.LoginResponse,
)
async def token(
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post(
    "/Perusahaan",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.Perusahaan,
)
async def create_perusahaan(data: schemas.PerusahaanIn):
    perusahaan = await Perusahaan.create(**data.model_dump(exclude_unset=True))
    return perusahaan


@router.get(
    "/Perusahaan",
    status_code=status.HTTP_200_OK,
    description="Get perusahaan by ID",
    response_model=schemas.Perusahaan,
)
async def get_perusahaan(id: str):
    perusahaan = await Perusahaan.get_or_none(id=id)
    return perusahaan


@router.get(
    "/GetAllPerusahaan",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.Perusahaan],
    description="Get all perusahaan",
)
async def get_all_perusahaan():
    perusahaan = await Perusahaan.all()
    return perusahaan
