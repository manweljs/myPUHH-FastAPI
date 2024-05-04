from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "blok" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE,
    "tahun_id" UUID NOT NULL REFERENCES "tahun_kegiatan" ("id") ON DELETE CASCADE
);
        CREATE TABLE IF NOT EXISTS "ganis" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "berlaku_dari" DATE,
    "berlaku_sampai" DATE,
    "jabatan_id" UUID NOT NULL REFERENCES "jabatan_ganis" ("id") ON DELETE CASCADE,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE
);
        CREATE TABLE IF NOT EXISTS "petak" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "blok_id" UUID NOT NULL REFERENCES "blok" ("id") ON DELETE CASCADE,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE
);
        CREATE TABLE IF NOT EXISTS "tpk" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "kategori" INT NOT NULL  DEFAULT 0,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE
);
        CREATE TABLE IF NOT EXISTS "tpn" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE
);
        CREATE TABLE IF NOT EXISTS "tahun_kegiatan" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "tahun" INT NOT NULL,
    "tanggal_mulai" DATE,
    "tanggal_selesai" DATE,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "blok";
        DROP TABLE IF EXISTS "ganis";
        DROP TABLE IF EXISTS "petak";
        DROP TABLE IF EXISTS "tpk";
        DROP TABLE IF EXISTS "tpn";
        DROP TABLE IF EXISTS "tahun_kegiatan";"""
