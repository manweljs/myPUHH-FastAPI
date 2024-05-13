from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "buku_ukur" ADD "tahun_id" UUID NOT NULL;
        ALTER TABLE "buku_ukur" DROP COLUMN "obyek";
        ALTER TABLE "buku_ukur" ADD CONSTRAINT "fk_buku_uku_tahun_ke_19c3a5ef" FOREIGN KEY ("tahun_id") REFERENCES "tahun_kegiatan" ("id") ON DELETE CASCADE;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "buku_ukur" DROP CONSTRAINT "fk_buku_uku_tahun_ke_19c3a5ef";
        ALTER TABLE "buku_ukur" ADD "obyek" INT NOT NULL  DEFAULT 0;
        ALTER TABLE "buku_ukur" DROP COLUMN "tahun_id";"""
