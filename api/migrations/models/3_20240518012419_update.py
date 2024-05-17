from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "pohon" ALTER COLUMN "barcode_id" DROP NOT NULL;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "pohon" ALTER COLUMN "barcode_id" SET NOT NULL;"""
