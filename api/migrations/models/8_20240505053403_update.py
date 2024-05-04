from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "tarif" RENAME COLUMN "type" TO "jenis_tarif";"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "tarif" RENAME COLUMN "jenis_tarif" TO "type";"""
