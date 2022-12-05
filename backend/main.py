from typing import List
import fastapi as _fastapi
from fastapi.middleware.cors import CORSMiddleware
import fastapi.security as _security

import sqlalchemy.orm as _orm

import services as _services, schemas as _schemas, models as _models

app = _fastapi.FastAPI()

# _services.create_database()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/users")
async def create_user(
    user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        raise _fastapi.HTTPException(status_code=400, detail="Email already in use")

    user = await _services.create_user(user, db)

    return await _services.create_token(user)


@app.post("/api/token")
async def generate_token(
    form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    user = await _services.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise _fastapi.HTTPException(status_code=401, detail="Invalid Credentials")

    return await _services.create_token(user)


@app.get("/api/users/me", response_model=_schemas.User)
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user

@app.get("/api")
async def root():
    return {"message": "Save your money"}

@app.post("/users/{user_id}/add_money/", response_model=_schemas.Money_type)
def add_money(
    user_id: int,
    post: _schemas.Money_type_add,
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    db_user = _services.get_user(db=db, user_id=user_id)
    if db_user is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this user does not exist"
        )
    return _services.add_money(db=db, post=post, user_id=user_id)

@app.post("/users/{user_id}/add_category/", response_model=_schemas.Category_type)
def add_category(
    user_id: int,
    post: _schemas.Category_add,
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    db_user = _services.get_user(db=db, user_id=user_id)
    if db_user is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this user does not exist"
        )
    return _services.add_category(db=db, post=post, user_id=user_id)  

@app.post("/users/{user_id}/add_category_money/", response_model=_schemas.Category_quantity)
def add_category_money(
    category_id: int,
    post: _schemas.Category_add_money,
    db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    db_user = _services.get_category(db=db, category_id=category_id)
    if db_user is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this category does not exist"
        )
    return _services.add_category_money(db=db, post=post, category_type_id=_models.Category_type.id)  

#need fix in add money to category