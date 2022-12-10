import ast
import fastapi as _fastapi
import fastapi.security as _security
import jwt as _jwt
import datetime as _dt
import sqlalchemy.orm as _orm, sqlalchemy as _sql
import passlib.hash as _hash
import database as _database, models as _models, schemas as _schemas

oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")

JWT_SECRET = "myjwtsecret"


def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)


def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user(db: _orm.Session, user_id: int):
    return db.query(_models.User).filter(_models.User.id == user_id).first()


def get_category(db: _orm.Session, category_type_id: int):
    return (
        db.query(_models.Category_type)
        .filter(_models.Category_type.id == category_type_id)
        .first()
    )


async def get_user_by_email(email: str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.email == email).first()


async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    user_obj = _models.User(
        email=user.email, hashed_password=_hash.bcrypt.hash(user.hashed_password)
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj


async def authenticate_user(email: str, password: str, db: _orm.Session):
    user = await get_user_by_email(db=db, email=email)

    if not user:
        return False

    if not user.verify_password(password):
        return False

    return user


async def create_token(user: _models.User):
    user_obj = _schemas.User.from_orm(user)

    token = _jwt.encode(user_obj.dict(), JWT_SECRET)

    return dict(access_token=token, token_type="bearer")


async def get_current_user(
    db: _orm.Session = _fastapi.Depends(get_db),
    token: str = _fastapi.Depends(oauth2schema),
):
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(_models.User).get(payload["id"])
    except:
        raise _fastapi.HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )

    return _schemas.User.from_orm(user)

#money_type

def get_balance(db: _orm.Session, user_id: int):
    return db.query(_models.Money_type).filter(_models.Money_type.user_id == user_id).all()

def get_balance_id(db: _orm.Session, id: int):
    money_type_id = (
        db.query(_models.Money_type)
        .filter(_models.Money_type.id == id)
        .first()
    )
    return money_type_id

def get_total_balance(user_id: int, db: _orm.Session):
    value_sum = _sql.select(
        [_models.Money_type.user_id, _sql.func.sum(_models.Money_type.type_quantity)]
    ).group_by(_models.Money_type.user_id)
    result = _database.engine.execute(value_sum).fetchall()
    for item in result:
        if user_id is item[0]:
            user = (item[0], item[1])
        if user_id is item[0]-1:
            user = (item[0], item[1])
    return user

def get_money_type_id(db: _orm.Session, id: int, user_id: int):
    money_type_id = (
        db.query(_models.Money_type, user_id)
        .filter(_models.Money_type.id == id)
        .first()
    )
    return money_type_id


def add_money(db: _orm.Session, post: _schemas.Money_type_add, user_id: int):
    post = _models.Money_type(**post.dict(), user_id=user_id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def update_type_info(db: _orm.Session, id: int, post: _schemas.Money_type_add):

    db_post = get_balance_id(db=db, id=id)
    db_post.type_name = post.type_name
    db_post.type_description = post.type_description
    db_post.type_quantity = post.type_quantity
    db.commit()
    db.refresh(db_post)
    return db_post


def delete_money_type(db: _orm.Session, id: int, user_id: int):
    db.query(_models.Money_type, user_id).filter(
        _models.Money_type.id == id
    ).delete()
    db.commit()

#money_saving

def add_money_saving(db: _orm.Session, post: _schemas.Money_saving_add, user_id: int):
    post = _models.Money_saving(**post.dict(), user_id=user_id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

def get_saving(db: _orm.Session, user_id: int):
    return db.query(_models.Money_saving).filter(_models.Money_saving.user_id == user_id).all()

def get_money_saving_id(db: _orm.Session, id: int, user_id: int):
    saving_type_id = (
        db.query(_models.Money_saving, user_id)
        .filter(_models.Money_saving.id == id)
        .first()
    )
    return saving_type_id

def get_saving_id(db: _orm.Session, id: int):
    money_type_id = (
        db.query(_models.Money_saving)
        .filter(_models.Money_saving.id == id)
        .first()
    )
    return money_type_id

def update_saving_info(db: _orm.Session, id: int, post: _schemas.Money_saving_add):

    db_post = get_saving_id(db=db, id=id)
    db_post.saving_name = post.saving_name
    db_post.saving_description = post.saving_description
    db_post.saving_quantity = post.saving_quantity
    db_post.saving_persentage = post.saving_persentage
    db_post.saving_period_start = post.saving_period_start
    db_post.saving_period_end = post.saving_period_end
    db.commit()
    db.refresh(db_post)
    return db_post

def delete_money_saving(db: _orm.Session, id: int, user_id: int):
    db.query(_models.Money_saving, user_id).filter(
        _models.Money_saving.id == id
    ).delete()
    db.commit()

#money_income

def add_money_income(db: _orm.Session, post: _schemas.Money_income_add, user_id: int):
    post = _models.Money_income(**post.dict(), user_id=user_id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

def get_money_income(db: _orm.Session, user_id: int):
    return db.query(_models.Money_income).filter(_models.Money_income.user_id == user_id).all()

def get_money_income_id(db: _orm.Session, id: int, user_id: int):
    income_type_id = (
        db.query(_models.Money_income, user_id)
        .filter(_models.Money_income.id == id)
        .first()
    )
    return income_type_id

def get_income_id(db: _orm.Session, id: int):
    income_type_id = (
        db.query(_models.Money_income)
        .filter(_models.Money_income.id == id)
        .first()
    )
    return income_type_id

def update_income_info(db: _orm.Session, id: int, post: _schemas.Money_income_add):

    db_post = get_income_id(db=db, id=id)
    db_post.income_type = post.income_type
    db_post.income_description = post.income_description
    db_post.income_quantity = post.income_quantity
    db_post.income_period = post.income_period
    db.commit()
    db.refresh(db_post)
    return db_post

def delete_money_income(db: _orm.Session, id: int, user_id: int):
    db.query(_models.Money_income, user_id).filter(
        _models.Money_income.id == id
    ).delete()
    db.commit()

#category

def add_category(db: _orm.Session, post: _schemas.Category_add, user_id: int):
    post = _models.Category_type(**post.dict(), user_id=user_id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def add_category_money(
    db: _orm.Session,
    post: _schemas.Category_add_money,
    category_type_id: int,
    user_id: int,
):
    category_type_id = (
        db.query(_models.Category_type)
        .filter(_models.Category_type.id == category_type_id)
        .first()
    ).__dict__["id"]
    post = _models.Category_quantity(
        **post.dict(), category_type_id=category_type_id, user_id=user_id
    )
    print(category_type_id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def calc_add_category_money(
    db: _orm.Session, paiment_id:int):
    bal = float(str(list(db.query(_models.Money_type.type_quantity).filter(_models.Money_type.id == paiment_id).first())).replace("[", "").replace("]",""))
    print(bal)
    # db_post = get_balance_id(db=db, id=id)
    # db_post.type_quantity = bal
    # db.commit()
    # db.refresh(db_post)
    # return db_post
