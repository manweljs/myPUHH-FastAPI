from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "petak" ADD "luas" DOUBLE PRECISION NOT NULL  DEFAULT 0;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "petak" DROP COLUMN "luas";"""
