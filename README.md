# project
create folder

open folder

open cmd

python -m venv venv

cd venv/scripts

activate.bat

cd ..

cd ..

pip install passlib[bcrypt] SQLAlchemy fastapi[all] pyjwt

uvicorn main:app --reload
