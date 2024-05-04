from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "users" ADD "role" VARCHAR(50) NOT NULL  DEFAULT 'operator';
        ALTER TABLE "users" ADD "perusahaan_id" UUID;
        ALTER TABLE "users" ADD CONSTRAINT "fk_users_perusaha_68893ca1" FOREIGN KEY ("perusahaan_id") REFERENCES "perusahaan" ("id") ON DELETE SET NULL;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "users" DROP CONSTRAINT "fk_users_perusaha_68893ca1";
        ALTER TABLE "users" DROP COLUMN "role";
        ALTER TABLE "users" DROP COLUMN "perusahaan_id";"""
