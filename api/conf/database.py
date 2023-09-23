from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv


load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# Replace 'your_postgresql_username', 'your_postgresql_password', 'your_postgresql_db', and 'localhost' with your actual PostgreSQL credentials and IP address
DATABASE_URL = (
    f"postgresql://{DB_USER}:{DB_PASSWORD}@host.docker.internal:5432/{DB_NAME}"
)

# Create a database engine
engine = create_engine(DATABASE_URL)

# Check if the engine is valid and print a message accordingly
if engine:
    print("Database connected!")
    print(engine)

Base = declarative_base()
# Create tables based on the models
Base.metadata.create_all(engine)

# Create a session
Session = sessionmaker(bind=engine)
session = Session()
