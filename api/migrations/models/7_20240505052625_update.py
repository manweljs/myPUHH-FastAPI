from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "jenis" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "kelompok_jenis" VARCHAR(255) NOT NULL
);
        CREATE TABLE IF NOT EXISTS "kelompok_jenis" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL
);
        CREATE TABLE IF NOT EXISTS "sortimen" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL
);
        CREATE TABLE IF NOT EXISTS "tarif" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "type" INT NOT NULL  DEFAULT 0,
    "harga" DOUBLE PRECISION NOT NULL  DEFAULT 0,
    "kelompok_jenis_id" UUID NOT NULL REFERENCES "kelompok_jenis" ("id") ON DELETE CASCADE,
    "sortimen_id" UUID NOT NULL REFERENCES "sortimen" ("id") ON DELETE CASCADE
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "jenis";
        DROP TABLE IF EXISTS "kelompok_jenis";
        DROP TABLE IF EXISTS "sortimen";
        DROP TABLE IF EXISTS "tarif";"""
