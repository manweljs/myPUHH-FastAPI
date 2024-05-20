from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "pohon" ADD "lhc_id" UUID NOT NULL;
        ALTER TABLE "pohon" ADD CONSTRAINT "fk_pohon_lhc_1b54c0af" FOREIGN KEY ("lhc_id") REFERENCES "lhc" ("id") ON DELETE CASCADE;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "pohon" DROP CONSTRAINT "fk_pohon_lhc_1b54c0af";
        ALTER TABLE "pohon" DROP COLUMN "lhc_id";"""
