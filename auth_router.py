from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from auth import create_user, authenticate_user, create_access_token

router = APIRouter()


class UserIn(BaseModel):
    username: str
    password: str


# Create default hackathon user
create_user("admin", "admin123")


@router.post("/login")
async def login(user: UserIn):
    if not authenticate_user(user.username, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.username})

    return {
        "access_token": token,
        "token_type": "bearer"
    }
