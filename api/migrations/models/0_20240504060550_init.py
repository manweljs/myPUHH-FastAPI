from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "tokens" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "access_token" TEXT NOT NULL,
    "token_type" TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "username" VARCHAR(50) NOT NULL UNIQUE,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "avatar" TEXT,
    "is_active" BOOL NOT NULL  DEFAULT False
);
CREATE TABLE IF NOT EXISTS "propinsi" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS "kabupaten" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "propinsi_id" UUID NOT NULL REFERENCES "propinsi" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "perusahaan" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "alamat" TEXT,
    "logo" TEXT,
    "kabupaten_id" UUID REFERENCES "kabupaten" ("id") ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS "operators" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE,
    "user_id" UUID NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """
