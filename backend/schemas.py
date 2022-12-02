import datetime as _dt
from typing import List 
import pydantic as _pydantic


class _UserBase(_pydantic.BaseModel):
    email: str


class UserCreate(_UserBase):
    hashed_password: str

    class Config:
        orm_mode = True


class User(_UserBase):
    id: int
    money_id: List[Money]
    category_id: List[Category]
    class Config:
        orm_mode = True

# class _MoneyBase(_pydantic.BaseModel):


# class _CategoryBase(_pydantic.BaseModel):
    