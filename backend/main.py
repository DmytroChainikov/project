from typing import List
import fastapi as _fastapi
from fastapi.middleware.cors import CORSMiddleware
import fastapi.security as _security
import sqlalchemy.orm as _orm, sqlalchemy as _sql
import database as _database
import services as _services, schemas as _schemas, models as _models
app = _fastapi.FastAPI()

#_services.create_database()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/users", tags=["users"])
async def create_user(
    user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    email_valid = _services.is_valid_email(user.email)
    if email_valid:
        raise _fastapi.HTTPException(status_code=400, detail="Not valid email")
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        raise _fastapi.HTTPException(status_code=400, detail="Email already in use")
    user = await _services.create_user(user, db)

    return await _services.create_token(user)

@app.post("/api/token", tags=["users"])
async def generate_token(
    form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    user = await _services.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise _fastapi.HTTPException(status_code=401, detail="Invalid Credentials")

    return await _services.create_token(user)


@app.get("/api/users/me", response_model=_schemas.User, tags=["users"])
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user

@app.get("/api/users/id", tags=["users"])
async def get_user(user: int = _fastapi.Depends(_services.get_current_user_id)):
    user_id = user.id
    return user_id

@app.get("/api/users/currency", tags=["users"])
async def get_user(base_currency: str = _fastapi.Depends(_services.get_current_user_currency)):
    user_currency = base_currency
    return user_currency

@app.put("/api/users/edit", response_model=_schemas.User_edit, tags=["users"])
async def update_user(
    user_update: _schemas.User_edit,
    user: int = _fastapi.Depends(_services.get_current_user_id),
    db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    db_user = _services.get_user(db=db, user_id=user.id)
    if db_user is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this user does not exist"
        )
    if user_update.main_currency:
        db_user.main_currency = user_update.main_currency

    db.commit()
    db.refresh(db_user)

    return db_user


@app.get("/api", tags=["name"])
async def root():
    return {"message": "Save your money"}


@app.post(
    "/money/add_money/", response_model=_schemas.Money_type, tags=["money"]
)
def add_money(
    post: _schemas.Money_type_add,
    user: int = _fastapi.Depends(_services.get_current_user_id),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    db_user = _services.get_user(db=db, user_id=user.id)
    if db_user is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this user does not exist"
        )

    return _services.add_money(db=db, post=post, user_id=user.id)


@app.get("/money/get_balance", tags=["money"])
def get_balance(user: int = _fastapi.Depends(_services.get_current_user_id), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    post = _services.get_balance(db=db, user_id=user.id)
    return post

@app.get("/money/get_random_balance", tags=["money"])
def get_random_balance(user: int = _fastapi.Depends(_services.get_current_user_id), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    post = _services.get_random_balance(db=db, user_id=user.id)
    return post
# @app.get("/money/get_total_balance", tags=["money"])
# def get_total_balance(
#     user: int = _fastapi.Depends(_services.get_current_user_id), db: _orm.Session = _fastapi.Depends(_services.get_db)
# ):
#     result = _services.get_total_balance(db=db, user_id=user.id)

#     if result[0] != user.id:
#         raise _fastapi.HTTPException(
#             status_code=404, detail="sorry this user does not exist"
#         )
#     print(result)
#     return result

@app.get("/money/get_total_balance", tags=["money"])
def get_total_balance(
    user: int = _fastapi.Depends(_services.get_current_user_id),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    result = _services.get_total_amount(db=db, user_id=user.id)

    return result

@app.get("/money/get_money_type_id", tags=["money"])
def get_money_type_id(
    id: int,
    user: int = _fastapi.Depends(_services.get_current_user_id),
    db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    post = _services.get_money_type_id(db=db, user_id=user.id, id=id)
    return post


@app.put(
    "/money/edit_money_type",
    tags=["money"],
    response_model=_schemas.Money_type,
)
def update_type_info(
    id: int,
    post: _schemas.Money_type_add,
    user: int = _fastapi.Depends(_services.get_current_user_id),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    db_user = _services.get_user(db=db, user_id=user.id)
    if db_user is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this user does not exist"
        )
    money_type_id = _services.get_money_type_id(db=db, user_id=user.id, id=id)
    if money_type_id is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this money type does not exist"
        )
    return _services.update_type_info(db=db, post=post, id=id)


@app.delete("/money/money_type_delete", tags=["money"])
def delete_money_type(
    id: int, user: int = _fastapi.Depends(_services.get_current_user_id), db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    db_user = _services.get_user(db=db, user_id=user.id)
    if db_user is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this user does not exist"
        )
    money_type_id = _services.get_money_type_id(db=db, user_id=user.id, id=id)
    if money_type_id is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this money type does not exist"
        )
    _services.delete_money_type(db=db, id=id, user_id=user.id)
    return {"message": f"successfully deleted money type"}


@app.post(
    "/money/add_money_saving/",
    response_model=_schemas.Money_saving,
    tags=["money_saving"],
)
def add_money_saving(
    post: _schemas.Money_saving_add,
    user: int = _fastapi.Depends(_services.get_current_user_id),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    db_user = _services.get_user(db=db, user_id=user.id)
    if db_user is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this user does not exist"
        )

    return _services.add_money_saving(db=db, post=post, user_id=user.id)


@app.get("/money/get_saving", tags=["money_saving"])
def get_saving(user: int = _fastapi.Depends(_services.get_current_user_id), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    post = _services.get_saving(db=db, user_id=user.id)
    return post

@app.get("/money/get_total_saving", tags=["money_saving"])
def get_total_balance(
    user: int = _fastapi.Depends(_services.get_current_user_id),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    result = _services.get_total_saving_amount(db=db, user_id=user.id)

    return result

@app.put(
    "/money/edit_saving_type",
    tags=["money_saving"],
    response_model=_schemas.Money_saving,
)
def update_saving_info(
    id: int,
    post: _schemas.Money_saving_add,
    user: int = _fastapi.Depends(_services.get_current_user_id),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    saving_type_id = _services.get_money_saving_id(db=db, user_id=user.id, id=id)
    if saving_type_id is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this saving type does not exist"
        )
    return _services.update_saving_info(db=db, post=post, id=id)


@app.delete("/money/money_saving_delete", tags=["money_saving"])
def delete_money_saving(
    id: int, user: int = _fastapi.Depends(_services.get_current_user_id), db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    db_user = _services.get_user(db=db, user_id=user.id)
    if db_user is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this user does not exist"
        )
    money_income_id = _services.get_money_saving_id(db=db, user_id=user.id, id=id)
    if money_income_id is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this money type does not exist"
        )

    _services.delete_money_saving(db=db, id=id, user_id=user.id)

    return {"message": f"successfully deleted saving type"}


# money_income


@app.post(
    "/money/add_money_income/",
    response_model=_schemas.Money_income,
    tags=["money_income"],
)
def add_money_income(
    post: _schemas.Money_income_add,
    user: int = _fastapi.Depends(_services.get_current_user_id),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    db_user = _services.get_user(db=db, user_id=user.id)
    if db_user is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this user does not exist"
        )

    return _services.add_money_income(db=db, post=post, user_id=user.id)


@app.get("/money/get_money_income", tags=["money_income"])
def get_money_income(
    user: int = _fastapi.Depends(_services.get_current_user_id), db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    post = _services.get_money_income(db=db, user_id=user.id)
    return post


@app.put(
    "/money/edit_money_income",
    tags=["money_income"],
    response_model=_schemas.Money_income,
)
def update_income_info(
    id: int,
    post: _schemas.Money_income_add,
    user: int = _fastapi.Depends(_services.get_current_user_id),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    income_type_id = _services.get_money_income_id(db=db, user_id=user.id, id=id)
    if income_type_id is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this income type does not exist"
        )
    return _services.update_income_info(db=db, post=post, id=id)

@app.get("/money/get_total_income", tags=["money_income"])
def get_total_balance(
    user: int = _fastapi.Depends(_services.get_current_user_id),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    result = _services.get_total_income_amount(db=db, user_id=user.id)

    return result

@app.delete("/money/money_income_delete", tags=["money_income"])
def delete_money_income(
    id: int, user: int = _fastapi.Depends(_services.get_current_user_id), db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    db_user = _services.get_user(db=db, user_id=user.id)
    if db_user is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this user does not exist"
        )
    money_income_id = _services.get_money_income_id(db=db, user_id=user.id, id=id)
    if money_income_id is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this income type does not exist"
        )

    _services.delete_money_income(db=db, id=id, user_id=user.id)
    return {"message": f"successfully deleted saving type"}


# category


@app.post(
    "/category/add_category/",
    tags=["category"],
    response_model=_schemas.Category_type,
)
def add_category(
    post: _schemas.Category_add,
    user: int = _fastapi.Depends(_services.get_current_user_id),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    db_user = _services.get_user(db=db, user_id=user.id)
    if db_user is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this user does not exist"
        )
    return _services.add_category(db=db, post=post, user_id=user.id)


@app.get("/category/get_category", tags=["category"])
def get_category(user: int = _fastapi.Depends(_services.get_current_user_id), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    post = _services.get_category(db=db, user_id=user.id)
    return post

@app.get("/category/get_category_type_id", tags=["category"])
def get_category_type_id(
    id: int,
    user: int = _fastapi.Depends(_services.get_current_user_id),
    db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    post = _services.get_category_type_id(db=db, user_id=user.id, id=id)
    return post

@app.put(
    "/category/edit_category",
    tags=["category"],
    response_model=_schemas.Category_type,
)
def update_category_type(
    id: int,
    post: _schemas.Category_add,
    user: int = _fastapi.Depends(_services.get_current_user_id),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    category_type_id = _services.get_category_id(db=db, id=id)
    if category_type_id is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this category does not exist"
        )
    return _services.update_category_type(db=db, post=post, id=id)

@app.delete("/category/category_delete", tags=["category"])
def delete_category(
    id: int, user: int = _fastapi.Depends(_services.get_current_user_id), db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    db_user = _services.get_user(db=db, user_id=user.id)
    if db_user is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this user does not exist"
        )
    category_type_id = _services.get_category_id(db=db, id=id)
    if category_type_id is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this category does not exist"
        )

    _services.delete_category(db=db, id=id, user_id=user.id)
    _services.delete_category_money(db=db, id=id, user_id=user.id)
    return {"message": f"successfully deleted saving type"}


@app.post(
    "/category/add_category_money/",
    response_model=_schemas.Category_quantity,
    tags=["category"],
)
def add_category_money(
    category_type_id: int,
    payment_id: int,
    post: _schemas.Category_add_money,
    user: int = _fastapi.Depends(_services.get_current_user_id),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    category_type_id = (
        db.query(_models.Category_type)
        .filter(_models.Category_type.id == category_type_id)
        .first()
    ).__dict__["id"]
    db_user = _services.get_user(db=db, user_id=user.id)

    if category_type_id is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this category does not exist"
        )
    if db_user is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this user does not exist"
        )
    return _services.add_category_money(
        db=db,
        post=post,
        category_type_id=category_type_id,
        user_id=user.id,
        payment_id=payment_id,
    )

@app.get("/category/get_costs", tags=["category"])
def get_costs(user: int = _fastapi.Depends(_services.get_current_user_id), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    post = _services.get_costs(db=db, user_id=user.id)
    return post

@app.get("/category/get_costs_by_id", tags=["category"])
def get_costs_by_id(category_type_id: int, user: int = _fastapi.Depends(_services.get_current_user_id), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    post = _services.get_costs_by_category_id(db=db, category_type_id=category_type_id)
    return post

@app.delete("/category/category_delete_money", tags=["category"])
def delete_cost(
    id: int, user: int = _fastapi.Depends(_services.get_current_user_id), db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    db_user = _services.get_user(db=db, user_id=user.id)
    if db_user is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this user does not exist"
        )
    category_type_id = _services.get_payment_id(db=db, id=id)
    if category_type_id is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this category does not exist"
        )
    _services.delete_cost(db=db, id=id, user_id=user.id)
    return {"message": f"successfully deleted saving type"}

@app.get("/category/get_sum_costs", tags=["category"])
def get_sum_costs(user: int = _fastapi.Depends(_services.get_current_user_id), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    post = _services.get_sum_costs(db=db, user_id=user.id)
    return post

@app.get("/category/get_total_sum_costs", tags=["category"])
def get_total_costs_sum(user: int = _fastapi.Depends(_services.get_current_user_id), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    data = _services.get_sum_costs(db=db, user_id=user.id)
    total_sum = _services.get_total_costs_sum(data)
    return total_sum
