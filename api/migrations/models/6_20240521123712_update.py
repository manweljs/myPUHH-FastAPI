from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE "rencana_tebang_blok" (
    "blok_id" UUID NOT NULL REFERENCES "blok" ("id") ON DELETE CASCADE,
    "rencana_tebang_id" UUID NOT NULL REFERENCES "rencana_tebang" ("id") ON DELETE CASCADE
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "rencana_tebang_blok";"""
