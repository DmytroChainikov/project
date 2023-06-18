import ast
import re
import fastapi as _fastapi
import fastapi.security as _security
import jwt as _jwt
import datetime as _dt
import sqlalchemy.orm as _orm, sqlalchemy as _sql
import passlib.hash as _hash
import database as _database, models as _models, schemas as _schemas
import requests
import random

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
        email=user.email,
        hashed_password=_hash.bcrypt.hash(user.hashed_password),
        main_currency="UAH",
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


async def get_current_user_id(
    db: _orm.Session = _fastapi.Depends(get_db),
    token: str = _fastapi.Depends(oauth2schema),
):
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(_models.User).get(payload["id"])
        print(user.id)
    except:
        raise _fastapi.HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )

    return user


async def get_current_user_currency(
    db: _orm.Session = _fastapi.Depends(get_db),
    token: str = _fastapi.Depends(oauth2schema),
):
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(_models.User).get(payload["id"])
        base_currency = user.main_currency
    except:
        raise _fastapi.HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )

    return base_currency


def is_valid_email(email):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if re.match(pattern, email):
        return False
    else:
        return True


def user_currency(db: _orm.Session, id: int):
    user_currency = db.query(_models.User).filter(_models.User.id == id).first()
    return user_currency


# money_type


def get_balance(db: _orm.Session, user_id: int):
    return (
        db.query(_models.Money_type).filter(_models.Money_type.user_id == user_id).all()
    )

def get_random_balance(db: _orm.Session, user_id: int):
    results = db.query(_models.Money_type).filter(_models.Money_type.user_id == user_id).all()
    if results:
        random_element = random.choice(results)
        return random_element
    else:
        return None

def get_balance_id(db: _orm.Session, id: int):
    money_type_id = (
        db.query(_models.Money_type).filter(_models.Money_type.id == id).first()
    )
    return money_type_id


def get_exchange_rates():
    api_url = f"https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json"
    response = requests.get(api_url)
    if response.status_code == requests.codes.ok:
        exchange_rates = response.json()
        return exchange_rates
    else:
        print("Error:", response.status_code, response.text)
        return None


# Отримання загальної суми в базовій валюті
def get_total_amount(user_id: int, db: _orm.Session):
    data_array = (
        db.query(_models.Money_type).filter(_models.Money_type.user_id == user_id).all()
    )
    name_list = [
        {"type_quantity": item.type_quantity, "type_currency": item.type_currency}
        for item in data_array
    ]
    user = db.query(_models.User).get(user_id)
    base_currency = user.main_currency
    exchange_rates = get_exchange_rates()
    exchange_rates.append({"txt": "Гривня", "rate": 1, "cc": "UAH"})
    sum = 0
    for item in name_list:
        if item["type_currency"] == "UAH" and base_currency != "UAH":
            data = list(filter(lambda u: u["cc"] == base_currency, exchange_rates))[0][
                "rate"
            ]
            sum += item["type_quantity"] / data
        elif item["type_currency"] == "UAH" and base_currency == "UAH":
            sum += item["type_quantity"]
        else:
            sum += (
                list(
                    filter(lambda u: u["cc"] == item["type_currency"], exchange_rates)
                )[0]["rate"]
                / list(filter(lambda u: u["cc"] == base_currency, exchange_rates))[0][
                    "rate"
                ]
            ) * item["type_quantity"]

    result = round(sum, 2)

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


def update_type_info(db: _orm.Session, id: int, post: _schemas.Money_type_add):

    db_post = get_balance_id(db=db, id=id)
    db_post.type_name = post.type_name
    db_post.type_currency = post.type_currency
    db_post.type_quantity = post.type_quantity
    db.commit()
    db.refresh(db_post)
    return db_post


def delete_money_type(db: _orm.Session, id: int, user_id: int):
    db.query(_models.Money_type, user_id).filter(_models.Money_type.id == id).delete()
    db.commit()


# money_saving


def add_money_saving(db: _orm.Session, post: _schemas.Money_saving_add, user_id: int):
    post = _models.Money_saving(**post.dict(), user_id=user_id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def get_saving(db: _orm.Session, user_id: int):
    return (
        db.query(_models.Money_saving)
        .filter(_models.Money_saving.user_id == user_id)
        .all()
    )


def get_money_saving_id(db: _orm.Session, id: int, user_id: int):
    saving_type_id = (
        db.query(_models.Money_saving, user_id)
        .filter(_models.Money_saving.id == id)
        .first()
    )
    return saving_type_id


def get_saving_id(db: _orm.Session, id: int):
    money_type_id = (
        db.query(_models.Money_saving).filter(_models.Money_saving.id == id).first()
    )
    return money_type_id


def get_total_saving_amount(user_id: int, db: _orm.Session):
    data_array = (
        db.query(_models.Money_saving)
        .filter(_models.Money_saving.user_id == user_id)
        .all()
    )
    name_list = [
        {
            "saving_quantity": item.saving_quantity,
            "saving_currency": item.saving_currency,
        }
        for item in data_array
    ]
    user = db.query(_models.User).get(user_id)
    base_currency = user.main_currency
    exchange_rates = get_exchange_rates()
    exchange_rates.append({"txt": "Гривня", "rate": 1, "cc": "UAH"})
    sum = 0
    for item in name_list:
        if item["saving_quantity"] == "UAH" and base_currency != "UAH":
            data = list(filter(lambda u: u["cc"] == base_currency, exchange_rates))[0][
                "rate"
            ]
            sum += item["saving_currency"] / data
        elif item["saving_quantity"] == "UAH" and base_currency == "UAH":
            sum += item["saving_currency"]
        else:
            sum += (
                list(
                    filter(lambda u: u["cc"] == item["saving_currency"], exchange_rates)
                )[0]["rate"]
                / list(filter(lambda u: u["cc"] == base_currency, exchange_rates))[0][
                    "rate"
                ]
            ) * item["saving_quantity"]

    result = round(sum, 2)

    return result


def update_saving_info(db: _orm.Session, id: int, post: _schemas.Money_saving_add):

    db_post = get_saving_id(db=db, id=id)
    db_post.saving_name = post.saving_name
    db_post.saving_description = post.saving_description
    db_post.saving_quantity = post.saving_quantity
    db_post.saving_currency = post.saving_currency
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


# money_income


def add_money_income(db: _orm.Session, post: _schemas.Money_income_add, user_id: int):
    post = _models.Money_income(**post.dict(), user_id=user_id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def get_money_income(db: _orm.Session, user_id: int):
    return (
        db.query(_models.Money_income)
        .filter(_models.Money_income.user_id == user_id)
        .all()
    )


def get_money_income_id(db: _orm.Session, id: int, user_id: int):
    income_type_id = (
        db.query(_models.Money_income, user_id)
        .filter(_models.Money_income.id == id)
        .first()
    )
    return income_type_id


def get_income_id(db: _orm.Session, id: int):
    income_type_id = (
        db.query(_models.Money_income).filter(_models.Money_income.id == id).first()
    )
    return income_type_id


def get_total_income_amount(user_id: int, db: _orm.Session):
    data_array = (
        db.query(_models.Money_income)
        .filter(_models.Money_income.user_id == user_id)
        .all()
    )
    name_list = [
        {
            "income_quantity": item.income_quantity,
            "income_currency": item.income_currency,
        }
        for item in data_array
    ]
    user = db.query(_models.User).get(user_id)
    base_currency = user.main_currency
    exchange_rates = get_exchange_rates()
    exchange_rates.append({"txt": "Гривня", "rate": 1, "cc": "UAH"})
    sum = 0
    for item in name_list:
        if item["income_quantity"] == "UAH" and base_currency != "UAH":
            data = list(filter(lambda u: u["cc"] == base_currency, exchange_rates))[0][
                "rate"
            ]
            sum += item["income_currency"] / data
        elif item["income_quantity"] == "UAH" and base_currency == "UAH":
            sum += item["income_currency"]
        else:
            sum += (
                list(
                    filter(lambda u: u["cc"] == item["income_currency"], exchange_rates)
                )[0]["rate"]
                / list(filter(lambda u: u["cc"] == base_currency, exchange_rates))[0][
                    "rate"
                ]
            ) * item["income_quantity"]

    result = round(sum, 2)

    return result


def update_income_info(db: _orm.Session, id: int, post: _schemas.Money_income_add):

    db_post = get_income_id(db=db, id=id)
    db_post.income_type = post.income_type
    db_post.income_description = post.income_description
    db_post.income_quantity = post.income_quantity
    db_post.income_currency = post.income_currency
    db_post.income_period = post.income_period
    db.commit()
    db.refresh(db_post)
    return db_post


def delete_money_income(db: _orm.Session, id: int, user_id: int):
    db.query(_models.Money_income, user_id).filter(
        _models.Money_income.id == id
    ).delete()
    db.commit()


# category


def add_category(db: _orm.Session, post: _schemas.Category_add, user_id: int):
    post = _models.Category_type(**post.dict(), user_id=user_id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def get_category(db: _orm.Session, user_id: int):
    return (
        db.query(_models.Category_type)
        .filter(_models.Category_type.user_id == user_id)
        .all()
    )


def get_category_id(db: _orm.Session, id: int):
    category_type_id = (
        db.query(_models.Category_type).filter(_models.Category_type.id == id).first()
    )
    return category_type_id


def get_category_type_id(db: _orm.Session, id: int, user_id: int):
    category_type_id = (
        db.query(_models.Category_type, user_id)
        .filter(_models.Category_type.id == id)
        .first()
    )
    return category_type_id


def update_category_type(db: _orm.Session, id: int, post: _schemas.Category_add):

    db_post = get_category_id(db=db, id=id)
    db_post.category_name = post.category_name
    db_post.category_description = post.category_description
    db.commit()
    db.refresh(db_post)
    return db_post


def delete_category(db: _orm.Session, id: int, user_id: int):
    db.query(_models.Category_type, user_id).filter(
        _models.Category_type.id == id
    ).delete()
    db.commit()


def delete_category_money(db: _orm.Session, id: int, user_id: int):
    db.query(_models.Category_quantity, user_id).filter(
        _models.Category_quantity.category_type_id == id
    ).delete()
    db.commit()


def delete_category_money_id(db: _orm.Session, id: int, user_id: int):
    db.query(_models.Category_quantity, user_id).filter(
        _models.Category_quantity.id == id
    ).delete()
    db.commit()


def add_category_money(
    db: _orm.Session,
    post: _schemas.Category_add_money,
    category_type_id: int,
    user_id: int,
    payment_id: int,
):
    category_type_id = (
        db.query(_models.Category_type)
        .filter(_models.Category_type.id == category_type_id)
        .first()
    ).__dict__["id"]
    get_balance = _models.Category_quantity(
        **post.dict(), category_type_id=category_type_id, user_id=user_id
    )
    bal = float(
        str(
            list(
                db.query(_models.Money_type.type_quantity)
                .filter(_models.Money_type.id == payment_id)
                .first()
            )
        )
        .replace("[", "")
        .replace("]", "")
    )
    fff = db.query(_models.Money_type.type_currency).filter(_models.Money_type.id == payment_id).first()
    category_name = (list(db.query(_models.Category_type.category_name).filter(_models.Category_type.id == category_type_id).first())[0])
    print(list(fff)[0])
    balance = get_balance.category_quantity
    result = bal - balance
    if result >= 0:
        db_post = get_balance_id(db=db, id=payment_id)
        db_post.type_quantity = result
        db.commit()
        db.refresh(db_post)

        def post_add_category_money():
            category_type_id = (
                db.query(_models.Category_type)
                .filter(_models.Category_type.id == category_type_id)
                .first()
            ).__dict__["id"]

        post = _models.Category_quantity(
            **post.dict(),
            category_type_id=category_type_id,
            payment_id=payment_id,
            payment_currency=list(fff)[0],
            category_name= category_name,
            user_id=user_id
        )
        db.add(post)
        db.commit()
        db.refresh(post)
    else:
        raise _fastapi.HTTPException(status_code=401, detail="Not enough money")
    return post


def get_costs(db: _orm.Session, user_id: int):
    return (
        db.query(_models.Category_quantity)
        .filter(_models.Category_quantity.user_id == user_id)
        .order_by(_models.Category_quantity.id.desc())
        .limit(10)
        .all()
    )


def get_costs_by_category_id(db: _orm.Session, category_type_id: int):
    return (
        db.query(_models.Category_quantity)
        .filter(_models.Category_quantity.category_type_id == category_type_id)
        .all()
    )
    
def get_sum_costs(db: _orm.Session, user_id: int):
    costs = db.query(_models.Category_quantity).filter_by(user_id=user_id).order_by(_models.Category_quantity.category_type_id).all()
    expenses_by_category = {}

    for cost in costs:
        category_id = cost.category_type_id
        if category_id not in expenses_by_category:
            expenses_by_category[category_id] = []
        expenses_by_category[category_id].append(cost)

    user = db.query(_models.User).get(user_id)
    base_currency = user.main_currency
    exchange_rates = get_exchange_rates()
    exchange_rates.append({"txt": "Гривня", "rate": 1, "cc": "UAH"})
    result_by_category = {}

    for category_id, expenses in expenses_by_category.items():
        category_result = []

        if len(expenses) == 1:
            expense = expenses[0]
            expense_result = {
                "category_quantity": round(expense.category_quantity, 2),
                "category_name": expense.category_name
            }
            if expense.payment_currency != base_currency:
                source_rate = next((rate["rate"] for rate in exchange_rates if rate["cc"] == expense.payment_currency), None)
                target_rate = next((rate["rate"] for rate in exchange_rates if rate["cc"] == base_currency), None)
                if source_rate and target_rate:
                    converted_quantity = expense.category_quantity * (source_rate / target_rate)
                    expense_result["category_quantity"] = round(converted_quantity, 2)

            category_result.append(expense_result)
        else:
            total_quantity = 0
            for expense in expenses:
                if expense.payment_currency != base_currency:
                    source_rate = next((rate["rate"] for rate in exchange_rates if rate["cc"] == expense.payment_currency), None)
                    target_rate = next((rate["rate"] for rate in exchange_rates if rate["cc"] == base_currency), None)
                    if source_rate and target_rate:
                        converted_quantity = expense.category_quantity * (source_rate / target_rate)
                        total_quantity += converted_quantity
                else:
                    total_quantity += expense.category_quantity

            category_result.append({
                "category_quantity": round(total_quantity, 2),
                "category_name": expenses[0].category_name
            })

        result_by_category[category_id] = category_result
    
    series = []
    max_data_length = max(len(expenses) for expenses in result_by_category.values())

    for category_id, expenses in result_by_category.items():
        category_name = expenses[0]['category_name']
        data = [round(expense['category_quantity'], 2) for expense in expenses]
        while len(data) < max_data_length:
            data.append(0)
        
        series.append({
            'category_name': category_name,
            'category_quantity': data
        })

    return series

def get_total_costs_sum(data):
    total_sum = 0

    for item in data:
        category_quantity = item['category_quantity'][0]
        total_sum += category_quantity

    return total_sum


def delete_cost(db: _orm.Session, id: int, user_id: int):
    payment_id = int(
        str(
            list(
                db.query(_models.Category_quantity.payment_id).filter(
                _models.Category_quantity.id == id)
                .first()
                )
            )
            .replace("[", "")
            .replace("]", "")
    )
    bal = float(
        str(
            list(
                db.query(_models.Money_type.type_quantity)
                .filter(_models.Money_type.id == payment_id)
                .first()
            )
        )
        .replace("[", "")
        .replace("]", "")
    )
    quantity = float(
        str(
            list(
                db.query(_models.Category_quantity.category_quantity).filter(
                _models.Category_quantity.id == id)
                .first()
                )
            )
            .replace("[", "")
            .replace("]", "")
    )
    result = bal + quantity
    db_post = get_balance_id(db=db, id=payment_id)
    db_post.type_quantity = result
    db.commit()
    db.refresh(db_post)
    db.query(_models.Category_quantity, user_id).filter(
        _models.Category_quantity.id == id
    ).delete()
    db.commit()


def get_payment_id(db: _orm.Session, id: int):
    payment_id = (
        db.query(_models.Category_quantity)
        .filter(_models.Category_quantity.id == id)
        .first()
    )
    return payment_id


# ======================================================================
