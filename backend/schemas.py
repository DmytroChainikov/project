import datetime as _dt
from typing import List 
import pydantic as _pydantic

class Money_type_base(_pydantic.BaseModel):
    type_name: str
    type_description: str
    type_quantity: float
    # class Config:
    #     orm_mode = True
    
class Money_type_add(Money_type_base):
    pass
      
class Money_type(Money_type_base):
    id: int
    user_id: int
    
    class Config:
        orm_mode = True

class Money_income_base(_pydantic.BaseModel):
    income_type: str
    income_description: str
    income_quantity: float
    income_period: int  
        
class Money_income_add(Money_income_base):
    pass
class Money_income(Money_income_base):
    id: int
    user_id: int
    
    class Config:
        orm_mode = True
class Money_saving_base(_pydantic.BaseModel):
    saving_name: str
    saving_quantity: float
    saving_persentage: float
    saving_description: str
    saving_period_start: _dt.date
    saving_period_end: _dt.date
    
class Money_saving_add(Money_saving_base):
    pass

class Money_saving(Money_saving_base):
    id: int
    user_id: int
    
    class Config:
        orm_mode = True
    
class Category_base(_pydantic.BaseModel):
    category_name: str
    category_description: str
    
class Category_add(Category_base):
    pass
  
class Category_type(Category_base):
    id: int
    user_id: int
    class Config:
        orm_mode = True
class Category_quantity_base(_pydantic.BaseModel):
    category_quantity: float
    quantity_description: str
class Category_add_money(Category_quantity_base):
    pass

class Category_quantity(Category_quantity_base):
    id: int
    category_type_id: int
    user_id: int
    class Config:
        orm_mode = True
    
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
    category_type_id: List[Category_type] = []
    category_quantity_id: List[Category_quantity] = []

class User(_UserBase):
    id: int
    money_id: List[Money] = []
    category_id: List[Category] = []
    class Config:
        orm_mode = True
    