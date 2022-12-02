import datetime as _dt
from typing import List 
import pydantic as _pydantic

class Money(_pydantic.BaseModel):
    id: int
    money_type_id: int
    money_income_id: int
    money_saving_id: int
    
class Money_type(_pydantic.BaseModel):
    id: int
    type: str
    type_name: str
    type_quantity: float
    type_description: str
    
class Money_income(_pydantic.BaseModel):
    id: int
    income_type: str
    income_quantity: float
    income_period: int  

class Money_saving(_pydantic.BaseModel):
    id: int
    saving_name: str
    saving_quantity: float
    saving_period_start: _dt.date
    saving_period_end: _dt.date
    saving_description: str
    
class Category(_pydantic.BaseModel):
    id: int
    category_type_id: int
    category_quantity_id: int
    
class Category_type(_pydantic.BaseModel):
    id: int
    category_name: str
    category_description: str
    
class Category_quantity(_pydantic.BaseModel):
    id: int
    category_quantity: float
    category_type_name: str
    
class _UserBase(_pydantic.BaseModel):
    email: str


class UserCreate(_UserBase):
    hashed_password: str

    class Config:
        orm_mode = True


class User(_UserBase):
    id: int
    money_id: List[Money] = []
    category_id: List[Category] = []
    class Config:
        orm_mode = True
    