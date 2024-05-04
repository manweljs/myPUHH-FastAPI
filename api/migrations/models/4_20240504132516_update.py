from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "tpk" ADD "alamat" VARCHAR(255);
        """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "tpk" DROP COLUMN "alamat";
        """
