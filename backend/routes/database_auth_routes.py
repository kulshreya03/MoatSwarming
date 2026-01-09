from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Annotated
from database.database import SessionLocal, engine
import database.models as models
from sqlalchemy.orm import Session

from pydantic import EmailStr

router = APIRouter(prefix="/auth", tags=["Authentication"])
models.Base.metadata.create_all(bind=engine)


class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    id: int
    name: str
    email: str

#Coonect to DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

#Auth endpoint
@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: db_dependency):
    user = db.query(models.Users).filter(models.Users.email == request.email,
                                         models.Users.password == request.password).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email
        }

    #return LoginResponse(id=user.id, name=user.name, email=user.email)

