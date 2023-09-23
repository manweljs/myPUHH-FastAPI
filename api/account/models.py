from sqlalchemy import create_engine, Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from uuid import uuid4

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        unique=True,
        nullable=False,
        default=uuid4,
    )
    username = Column(String, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    password = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    avatar = Column(String, nullable=True)


class Perusahaan(Base):
    __tablename__ = "perusahaan"

    id = Column(
        UUID(as_uuid=True), primary_key=True, unique=True, nullable=False, default=uuid4
    )
    nama = Column(String, nullable=False)
    alamat = Column(String, nullable=False)
    logo = Column(String, nullable=True)


class Operator(Base):
    __tablename__ = "operators"

    id = Column(
        UUID(as_uuid=True), primary_key=True, unique=True, nullable=False, default=uuid4
    )
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    perusahaan_id = Column(
        UUID(as_uuid=True), ForeignKey("perusahaan.id"), nullable=False
    )

    user = relationship("User", backref="operators")
    perusahaan = relationship("Perusahaan", backref="operators")
