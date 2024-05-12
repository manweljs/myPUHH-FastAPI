from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "tpn" ADD "blok_id" UUID;
        ALTER TABLE "tpn" ADD CONSTRAINT "fk_tpn_blok_69f53274" FOREIGN KEY ("blok_id") REFERENCES "blok" ("id") ON DELETE SET NULL;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "tpn" DROP CONSTRAINT "fk_tpn_blok_69f53274";
        ALTER TABLE "tpn" DROP COLUMN "blok_id";"""
