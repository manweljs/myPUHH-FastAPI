from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "spreadsheet_draft" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(255) NOT NULL,
    "object" VARCHAR(255) NOT NULL,
    "object_id" UUID NOT NULL,
    "file_url" TEXT NOT NULL,
    "version" INT NOT NULL  DEFAULT 1,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "spreadsheet_draft";"""
