from fastapi import Depends, HTTPException, status
from account.models import User, Perusahaan
from .tokens import get_current_user
import functools
import time


def login_required(func):
    async def wrapper(user: User = Depends(get_current_user)):
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
            )

        perusahaan = user.perusahaan_id
        if not perusahaan:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden"
            )
        return await func(user, perusahaan)

    return wrapper


def timing_decorator(func):
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = await func(*args, **kwargs)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
        end_time = time.time()
        duration = end_time - start_time
        print(f"Duration to process {func.__name__}: {duration:.2f} seconds.")
        return result

    return wrapper
