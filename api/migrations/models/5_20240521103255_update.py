from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "lhc" ADD "blok_id" UUID;
        ALTER TABLE "lhc" ADD CONSTRAINT "fk_lhc_blok_1f68eef9" FOREIGN KEY ("blok_id") REFERENCES "blok" ("id") ON DELETE SET NULL;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "lhc" DROP CONSTRAINT "fk_lhc_blok_1f68eef9";
        ALTER TABLE "lhc" DROP COLUMN "blok_id";"""
