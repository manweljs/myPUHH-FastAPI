from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL
);
CREATE TABLE IF NOT EXISTS "tokens" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "access_token" TEXT NOT NULL,
    "token_type" TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "kelas_diameter" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "nama" VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS "kelompok_jenis" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "nama" VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS "jenis" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "nama" VARCHAR(255) NOT NULL,
    "kelompok_jenis_id" INT REFERENCES "kelompok_jenis" ("id") ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS "kualifikasi_ganis" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "nama" VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS "jabatan_ganis" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "nama" VARCHAR(255) NOT NULL,
    "kualifikasi_id" INT NOT NULL REFERENCES "kualifikasi_ganis" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "propinsi" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "nama" VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS "kabupaten" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "nama" VARCHAR(255) NOT NULL,
    "propinsi_id" INT NOT NULL REFERENCES "propinsi" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "perusahaan" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "alamat" TEXT,
    "logo" TEXT,
    "kabupaten_id" INT REFERENCES "kabupaten" ("id") ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS "user" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "username" VARCHAR(50) NOT NULL UNIQUE,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "avatar" TEXT,
    "is_active" BOOL NOT NULL  DEFAULT False,
    "role" VARCHAR(50) NOT NULL  DEFAULT 'operator',
    "perusahaan_id" UUID REFERENCES "perusahaan" ("id") ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS "operator" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE,
    "user_id" UUID NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "rencana_tebang_type" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "nama" VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS "sortimen" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "nama" VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS "status_pohon" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "nama" VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS "tarif" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "nama" VARCHAR(255) NOT NULL,
    "jenis_tarif" INT NOT NULL  DEFAULT 0,
    "harga" DOUBLE PRECISION NOT NULL  DEFAULT 0,
    "kelompok_jenis_id" INT REFERENCES "kelompok_jenis" ("id") ON DELETE SET NULL,
    "sortimen_id" INT REFERENCES "sortimen" ("id") ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS "ganis" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "berlaku_dari" DATE,
    "berlaku_sampai" DATE,
    "jabatan_id" INT NOT NULL REFERENCES "jabatan_ganis" ("id") ON DELETE CASCADE,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "perusahaan_pembeli" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "alamat" VARCHAR(255),
    "kabupaten_id" INT REFERENCES "kabupaten" ("id") ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS "tpk" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "kategori" INT NOT NULL  DEFAULT 0,
    "alamat" VARCHAR(255),
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
);
CREATE TABLE IF NOT EXISTS "blok" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE,
    "tahun_id" UUID NOT NULL REFERENCES "tahun_kegiatan" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "petak" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "luas" DOUBLE PRECISION NOT NULL  DEFAULT 0,
    "blok_id" UUID NOT NULL REFERENCES "blok" ("id") ON DELETE CASCADE,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "tpn" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nama" VARCHAR(255) NOT NULL,
    "blok_id" UUID REFERENCES "blok" ("id") ON DELETE SET NULL,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE
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
    "koordinat_x" DOUBLE PRECISION,
    "koordinat_y" DOUBLE PRECISION,
    "jenis_id" INT NOT NULL REFERENCES "jenis" ("id") ON DELETE CASCADE,
    "kelas_diameter_id" INT REFERENCES "kelas_diameter" ("id") ON DELETE SET NULL,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE,
    "petak_id" UUID NOT NULL REFERENCES "petak" ("id") ON DELETE CASCADE,
    "sortimen_id" INT REFERENCES "sortimen" ("id") ON DELETE SET NULL,
    "status_pohon_id" INT REFERENCES "status_pohon" ("id") ON DELETE SET NULL
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
CREATE TABLE IF NOT EXISTS "buku_ukur" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nomor" VARCHAR(255) NOT NULL,
    "tanggal" DATE NOT NULL,
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
CREATE TABLE IF NOT EXISTS "barcode_pohon" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "barcode_id" UUID NOT NULL REFERENCES "barcode" ("id") ON DELETE CASCADE,
    "pohon_id" UUID NOT NULL REFERENCES "pohon" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "DK" (
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
    "sortimen" VARCHAR(3) NOT NULL  DEFAULT '2',
    "barcode_id" UUID REFERENCES "barcode" ("id") ON DELETE SET NULL,
    "buku_ukur_id" UUID NOT NULL REFERENCES "buku_ukur" ("id") ON DELETE CASCADE,
    "jenis_id" INT NOT NULL REFERENCES "jenis" ("id") ON DELETE CASCADE,
    "lhp_id" UUID REFERENCES "lhp" ("id") ON DELETE SET NULL,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE,
    "petak_id" UUID REFERENCES "petak" ("id") ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS "dkb_angkutan" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "nomor_dkb" VARCHAR(255) NOT NULL,
    "nomor_dokumen" VARCHAR(255) NOT NULL,
    "tanggal" DATE NOT NULL,
    "alat_angkut" INT NOT NULL  DEFAULT 0,
    "nama_alat_angkut" VARCHAR(255),
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
);
CREATE TABLE IF NOT EXISTS "spreadsheet_draft" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(255) NOT NULL,
    "object" VARCHAR(255) NOT NULL,
    "object_id" UUID NOT NULL,
    "file_url" TEXT NOT NULL,
    "version" INT NOT NULL  DEFAULT 1,
    "perusahaan_id" UUID NOT NULL REFERENCES "perusahaan" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "DKBBarcode" (
    "barcode_id" UUID NOT NULL REFERENCES "barcode" ("id") ON DELETE CASCADE,
    "dkbangkutan_id" UUID NOT NULL REFERENCES "dkb_angkutan" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "DKBBarcode" (
    "dkb_angkutan_id" UUID NOT NULL REFERENCES "dkb_angkutan" ("id") ON DELETE CASCADE,
    "barcode_id" UUID NOT NULL REFERENCES "barcode" ("id") ON DELETE CASCADE
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """
