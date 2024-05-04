from fastapi import Depends, HTTPException, status
from account.models import User, Perusahaan
from .tokens import get_current_user


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
