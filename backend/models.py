import datetime as _dt

import sqlalchemy as _sql
import sqlalchemy.orm as _orm
from sqlalchemy.orm import relationship
import passlib.hash as _hash

import database as _database


class User(_database.Base):
    __tablename__ = "users"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    email = _sql.Column(_sql.String, unique=True, index=True)
    money_id = relationship("Money", back_populates="user")
    category_id = relationship("Category", back_populates="user")
    hashed_password = _sql.Column(_sql.String)

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.hashed_password)
  

class Money(_database.Base):
    __tablename__ = "money"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    user_id = _sql.Column(_sql.Integer, _sql.ForeignKey("users.id"))
    money_type_id = relationship("Money_type", back_populates="money")
    money_income_id = relationship("Money_income", back_populates="money")
    money_saving_id = relationship("Money_saving", back_populates="money")
    
    user = _orm.relationship("User", back_populates="money_id")
    
money_category = _sql.Table(
    "money_category",
    _database.Base.metadata,
    _sql.Column("money_type_id", _sql.ForeignKey("money_type.id"), primary_key=True),
    _sql.Column("category_quantity_id", _sql.ForeignKey("category_quantity.id"), primary_key=True),
)

class Money_type(_database.Base):
    __tablename__ = "money_type"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    type = _sql.Column(_sql.String)
    type_name = _sql.Column(_sql.String)
    type_quantity = _sql.Column(_sql.Float)
    type_description = _sql.Column(_sql.String)
    
    money_id = _sql.Column(_sql.Integer, _sql.ForeignKey("money.id"))
    money = _orm.relationship("Money", back_populates="money_type_id")
    # category_type = _orm.relationship("Category_quantity", secondary=money_category, back_populates="money")
    
class Money_income(_database.Base):
    __tablename__ = "money_income"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    income_type = _sql.Column(_sql.String, unique=True)
    income_quantity = _sql.Column(_sql.Float)
    income_period = _sql.Column(_sql.Integer)
    
    money_id = _sql.Column(_sql.Integer, _sql.ForeignKey("money.id"))
    money = _orm.relationship("Money", back_populates="money_income_id")
    
class Money_saving(_database.Base):
    __tablename__ = "money_saving"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    saving_name = _sql.Column(_sql.String)
    saving_quantity = _sql.Column(_sql.Float)
    saving_period_start = _sql.Column(_sql.DateTime)
    saving_period_end = _sql.Column(_sql.DateTime)
    saving_description = _sql.Column(_sql.String)
    
    money_id = _sql.Column(_sql.Integer, _sql.ForeignKey("money.id"))
    money = _orm.relationship("Money", back_populates="money_saving_id")
        
class Category(_database.Base):
    __tablename__ = "category"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    user_id = _sql.Column(_sql.Integer, _sql.ForeignKey("users.id"))
    category_type = relationship("Category_type")
    category_quantity = relationship("Category_quantity")
        
    user = _orm.relationship("User", back_populates="category_id")
    
class Category_type(_database.Base):
    __tablename__ = "category_type"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    category_name = _sql.Column(_sql.String, unique=True)
    category_description = _sql.Column(_sql.String)
    
    category_id = _sql.Column(_sql.Integer, _sql.ForeignKey("category.id"))
        
class Category_quantity(_database.Base):
    __tablename__ = "category_quantity"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    category_quantity = _sql.Column(_sql.Float)
    category_type_name = _sql.Column(_sql.String)
    
    
    category_id = _sql.Column(_sql.Integer, _sql.ForeignKey("category.id"))
    
    # money = _orm.relationship("Money_type", secondary=money_category, back_populates="category_quantity")
    