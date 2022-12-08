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


def get_balance(db: _orm.Session, user_id: int, id: int):
    choice_list = (
        db.query(_models.Money_type).filter(_models.Money_type.user_id == user_id).all()
    )
    value_list: float = (
        db.query(_models.Money_type.type_quantity)
        .filter(_models.Money_type.user_id == user_id)
        .all()
    )
    return choice_list

def get_total_balance(user_id: int, db: _orm.Session):
    value_sum = _sql.select(
        [_models.Money_type.user_id == user_id, _sql.func.sum(_models.Money_type.type_quantity)]
    ).group_by(_models.Money_type.user_id == user_id)
    result = _database.engine.execute(value_sum).fetchall()
    for item in result:
        print(item[0], item[1])
    return result

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


def update_type_info(
    db: _orm.Session, user_id: int, id: int, post: _schemas.Money_type_add
):

    db_post = get_balance(db=db, id=id, user_id=user_id)
    db_post.type_name = post.type_name
    db_post.description = post.type_description
    db_post.quantity = post.type_quantity
    db.commit()
    db.refresh(db_post)
    return db_post


async def delete_money_type(db: _orm.Session, id: int, user_id: int):
    await db.query(_models.Money_type, user_id).filter(
        _models.Money_type.id == id
    ).delete()
    db.commit()


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
    db: _orm.Session, post: _schemas.Money_type_add, type_id: int
):
    get_money = (
        db.query(_models.Money_type)
        .filter(_models.Money_type.type_quantity == user_id)
        .all()
    )
