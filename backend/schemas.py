import datetime as _dt
from typing import List 
import pydantic as _pydantic

class _Money_type_base(_pydantic.BaseModel):
    type_name: str
    type_quantity: float | None
    type_description: str | None
    
    
class Money_type_add(_Money_type_base):
    pass
      
class Money_type(_Money_type_base):
    id: int
    class Config:
        orm_mode = True
    
class Money_income(_pydantic.BaseModel):
    id: int
    income_type: str
    income_quantity: float
    income_period: int  
    
    class Config:
        orm_mode = True

class Money_saving(_pydantic.BaseModel):
    id: int
    saving_name: str
    saving_quantity: float
    saving_period_start: _dt.date
    saving_period_end: _dt.date
    saving_description: str
    
    class Config:
        orm_mode = True
    
class Category_base(_pydantic.BaseModel):
    category_name: str
    category_description: str
    
class Category_add(Category_base):
    pass
  
class Category_type(Category_base):
    id: int
    
    class Config:
        orm_mode = True

class Category_quantity(_pydantic.BaseModel):
    id: int
    category_quantity: float
    category_type_name: str
    
class _UserBase(_pydantic.BaseModel):
    email: str

    class Config:
        orm_mode = True
class UserCreate(_UserBase):
    hashed_password: str

    class Config:
        orm_mode = True

class BaseModelll(_pydantic.BaseModel):
    class Config:
        orm_mode = True

class Money(BaseModelll):
    id: int 
    money_type_id: List[Money_type] = []
    money_income_id: List[Money_income] = []
    money_saving_id: List[Money_saving] = []
    
class Category(_pydantic.BaseModel):
    id: int
    category_type_id: int
    category_quantity_id: int

class User(_UserBase):
    id: int
    money_id: List[Money] = []
    category_id: List[Category] = []
    class Config:
        orm_mode = True
    