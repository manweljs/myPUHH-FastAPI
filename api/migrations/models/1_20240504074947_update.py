from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "operators" RENAME TO "operator";
         CREATE TABLE IF NOT EXISTS "kualifikasi_ganis" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL
);
        CREATE TABLE IF NOT EXISTS "jabatan_ganis" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "kualifikasi_id" UUID NOT NULL REFERENCES "kualifikasi_ganis" ("id") ON DELETE CASCADE
);
       
        CREATE TABLE IF NOT EXISTS "rencana_tebang_type" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "operator" RENAME TO "operators";
        DROP TABLE IF EXISTS "jabatan_ganis";
        DROP TABLE IF EXISTS "kualifikasi_ganis";
        DROP TABLE IF EXISTS "rencana_tebang_type";"""
