from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "tarif" ADD "kelompok_jenis" INT NOT NULL  DEFAULT 0;
        ALTER TABLE "tarif" ADD "sortimen" INT NOT NULL  DEFAULT 0;
        ALTER TABLE "tarif" DROP COLUMN "kelompok_jenis_id";
        ALTER TABLE "tarif" DROP COLUMN "sortimen_id";
        CREATE TABLE IF NOT EXISTS "perusahaan_pembeli" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "alamat" VARCHAR(255),
    "kabupaten_id" UUID REFERENCES "kabupaten" ("id") ON DELETE SET NULL
);
        CREATE TABLE IF NOT EXISTS "lhc" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nomor" VARCHAR(255) NOT NULL,
    "tanggal" DATE NOT NULL,
    "obyek" INT NOT NULL  DEFAULT 0,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE,
    "tahun_id" UUID NOT NULL REFERENCES "tahun_kegiatan" ("id") ON DELETE CASCADE
);
        CREATE TABLE IF NOT EXISTS "lhp" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nomor" VARCHAR(255) NOT NULL,
    "tanggal" DATE NOT NULL,
    "obyek" INT NOT NULL  DEFAULT 0,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE,
    "tahun_id" UUID NOT NULL REFERENCES "tahun_kegiatan" ("id") ON DELETE CASCADE
);

        CREATE TABLE IF NOT EXISTS "rencana_tebang" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nomor" VARCHAR(255) NOT NULL,
    "obyek" INT NOT NULL  DEFAULT 0,
    "tanggal" DATE NOT NULL,
    "faktor" DOUBLE PRECISION NOT NULL  DEFAULT 0.7,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE,
    "tahun_id" UUID NOT NULL REFERENCES "tahun_kegiatan" ("id") ON DELETE CASCADE
);

        CREATE TABLE IF NOT EXISTS "barcode" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "barcode" VARCHAR(255) NOT NULL UNIQUE,
    "is_industri" BOOL NOT NULL  DEFAULT False,
    "lhc_id" UUID NOT NULL REFERENCES "lhc" ("id") ON DELETE CASCADE,
    "lhp_id" UUID REFERENCES "lhp" ("id") ON DELETE SET NULL,
    "lokasi_id" UUID REFERENCES "tpk" ("id") ON DELETE SET NULL,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE,
    "perusahaan_pembeli_id" UUID REFERENCES "perusahaan_pembeli" ("id") ON DELETE SET NULL,
    "rencana_tebang_id" UUID REFERENCES "rencana_tebang" ("id") ON DELETE SET NULL
);

        CREATE TABLE IF NOT EXISTS "pohon" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nomor" INT NOT NULL,
    "jalur" VARCHAR(255),
    "arah_jalur" VARCHAR(255),
    "panjang_jalur" INT,
    "tinggi" DOUBLE PRECISION NOT NULL,
    "diameter" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "sortimen" INT NOT NULL  DEFAULT 0,
    "koordinat_x" DOUBLE PRECISION,
    "koordinat_y" DOUBLE PRECISION,
    "barcode_id" UUID REFERENCES "barcode" ("id") ON DELETE SET NULL,
    "jenis_id" UUID NOT NULL REFERENCES "jenis" ("id") ON DELETE CASCADE,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE,
    "petak_id" UUID NOT NULL REFERENCES "petak" ("id") ON DELETE CASCADE
);

        CREATE TABLE IF NOT EXISTS "buku_ukur" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nomor" VARCHAR(255) NOT NULL,
    "tanggal" DATE NOT NULL,
    "obyek" INT NOT NULL  DEFAULT 0,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE
);

        CREATE TABLE IF NOT EXISTS "tebangan" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nomor" INT NOT NULL,
    "panjang" DOUBLE PRECISION NOT NULL,
    "dp" INT NOT NULL,
    "du" INT NOT NULL,
    "diameter" INT NOT NULL,
    "cacat" INT NOT NULL  DEFAULT 0,
    "cacat_cm" INT,
    "cacat_persen" DOUBLE PRECISION,
    "volume" DOUBLE PRECISION NOT NULL,
    "potongan" VARCHAR(2),
    "sortimen" INT NOT NULL  DEFAULT 0,
    "barcode_id" UUID REFERENCES "barcode" ("id") ON DELETE SET NULL,
    "buku_ukur_id" UUID NOT NULL REFERENCES "buku_ukur" ("id") ON DELETE CASCADE,
    "jenis_id" UUID NOT NULL REFERENCES "jenis" ("id") ON DELETE CASCADE,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE,
    "petak_id" UUID REFERENCES "petak" ("id") ON DELETE SET NULL
);
        CREATE TABLE IF NOT EXISTS "lhp_tebangan" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "lhp_id" UUID NOT NULL REFERENCES "lhp" ("id") ON DELETE CASCADE,
    "tebangan_id" UUID NOT NULL REFERENCES "tebangan" ("id") ON DELETE CASCADE
);


        CREATE TABLE IF NOT EXISTS "dkb_angkutan" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nomor_dkb" VARCHAR(255) NOT NULL,
    "nomor_dokumen" VARCHAR(255) NOT NULL,
    "tanggal" DATE NOT NULL,
    "alat_angkut" INT NOT NULL  DEFAULT 0,
    "nama_alat_angkut" VARCHAR(255) NOT NULL,
    "dokumen_url" TEXT,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE,
    "tpk_asal_id" UUID NOT NULL REFERENCES "tpk" ("id") ON DELETE CASCADE,
    "tpk_tujuan_id" UUID NOT NULL REFERENCES "tpk" ("id") ON DELETE CASCADE
);
        CREATE TABLE IF NOT EXISTS "dkb_barcode" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "barcode_id" UUID NOT NULL REFERENCES "barcode" ("id") ON DELETE CASCADE,
    "dkb_id" UUID NOT NULL REFERENCES "dkb_angkutan" ("id") ON DELETE CASCADE
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "tarif" ADD "kelompok_jenis_id" UUID NOT NULL;
        ALTER TABLE "tarif" ADD "sortimen_id" UUID NOT NULL;
        ALTER TABLE "tarif" DROP COLUMN "kelompok_jenis";
        ALTER TABLE "tarif" DROP COLUMN "sortimen";
        DROP TABLE IF EXISTS "perusahaan_pembeli";
        DROP TABLE IF EXISTS "barcode";
        DROP TABLE IF EXISTS "lhc";
        DROP TABLE IF EXISTS "pohon";
        DROP TABLE IF EXISTS "rencana_tebang";
        DROP TABLE IF EXISTS "buku_ukur";
        DROP TABLE IF EXISTS "lhp_tebangan";
        DROP TABLE IF EXISTS "lhp";
        DROP TABLE IF EXISTS "tebangan";
        DROP TABLE IF EXISTS "dkb_angkutan";
        DROP TABLE IF EXISTS "dkb_barcode";
        ALTER TABLE "tarif" ADD CONSTRAINT "fk_tarif_kelompok_41cb40b5" FOREIGN KEY ("kelompok_jenis_id") REFERENCES "kelompok_jenis" ("id") ON DELETE CASCADE;
        ALTER TABLE "tarif" ADD CONSTRAINT "fk_tarif_sortimen_66ac4de1" FOREIGN KEY ("sortimen_id") REFERENCES "sortimen" ("id") ON DELETE CASCADE;"""
