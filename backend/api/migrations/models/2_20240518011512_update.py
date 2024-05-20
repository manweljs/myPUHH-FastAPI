from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "pohon" ADD "barcode_id" UUID NOT NULL;
        DROP TABLE IF EXISTS "barcode_pohon";
        ALTER TABLE "pohon" ADD CONSTRAINT "fk_pohon_barcode_17ad09af" FOREIGN KEY ("barcode_id") REFERENCES "barcode" ("id") ON DELETE CASCADE;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "pohon" DROP CONSTRAINT "fk_pohon_barcode_17ad09af";
        ALTER TABLE "pohon" DROP COLUMN "barcode_id";"""
