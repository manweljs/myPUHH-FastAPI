from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
import os
from dotenv import load_dotenv
from tortoise.contrib.fastapi import register_tortoise


load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# Replace 'your_postgresql_username', 'your_postgresql_password', 'your_postgresql_db', and 'localhost' with your actual PostgreSQL credentials and IP address
DATABASE_URL = f"postgres://{DB_USER}:{DB_PASSWORD}@host.docker.internal:5432/{DB_NAME}"

# Create a database engine
# engine = create_async_engine(DATABASE_URL, echo=True, future=True)
# Base = declarative_base()
# SessionLocal = async_sessionmaker(bind=engine, autocommit=False, autoflush=False)


# async def get_db():
#     async with engine.begin() as conn:
#         await conn.run_sync(Base.metadata.create_all)
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         await db.close()
