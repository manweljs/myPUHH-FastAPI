export type UserType = {
    id: number;
    username: string;
    email: string;
    role: string;
    perusahaan: PerusahaanType;

}

export type FileType = {
    uid: string
    name: string
    url?: string
    status?: string
    thumbUrl?: string
    percent?: number
    originFileObj?: File

}
export type PerusahaanType = {
    id: string;
    nama: string;
    alamat?: string;
    logo?: string;
    telepon?: string;
    kabupaten?: KabupatenType;
}

export type PerusahaanInType = {
    id?: string | null;
    nama: string;
    alamat?: string | null;
    logo?: string | null;
    telepon?: string | null;
    kabupaten_id?: string | null | undefined;
}

export interface TahunKegiatanType {
    id?: string;
    tahun: number;
    tanggal_mulai?: string | null;
    tanggal_selesai?: string | null;
}


export interface LHPType {
    id: string;
    tahun: TahunKegiatanType;
    nomor: string;
    tanggal: string;
    obyek: number;
}

export interface LHPInType {
    id?: string;
    tahun_id?: string;
    nomor: string;
    tanggal: string;
    obyek: number;
}

export interface RencanaTebangType {
    id: string;
    nomor: string;
    tahun: TahunKegiatanType;
    obyek: number;
    tanggal: string;
    faktor: number;
}

export interface RencanaTebangInType {
    id?: string;
    nomor: string;
    tahun_id?: string;
    obyek: number;
    tanggal: string;
    faktor: number;
}

export interface UploadBarcodeType {
    lhc_id: string,
    file_url: string
}

export interface LHCType {
    id: string;
    nomor: string;
    tahun: TahunKegiatanType;
    tanggal: string;
    obyek: number;
}

export interface LHCInType {
    id?: string | null;
    nomor: string;
    tahun_id: string | null;
    tanggal: string;
    obyek: number;
}

export interface BukuUkurType {
    id?: string;
    nomor: string;
    tanggal: string;
    obyek: number;
    tahun: TahunKegiatanType;
}

export interface BukuUkurInType {
    id?: string;
    nomor: string;
    tanggal: string;
    tahun_id?: string;
}

export interface PohonType {
    id: string;
    nomor: number;
    barcode: string;
    petak: string;
    jalur?: string;
    arah_jalur?: string;
    panjang_jalur?: number;
    jenis: string;
    tinggi: number;
    diameter: number;
    volume: number;
    sortimen: number;
    koordinat_x?: number | string;
    koordinat_y?: number | string;
}

export interface PohonInType {
    id?: string | null;
    nomor: number;
    barcode: string | null;
    petak: string;
    jalur?: string;
    arah_jalur?: string;
    panjang_jalur?: number;
    jenis: string;
    tinggi: number;
    diameter: number;
    volume: number;
    sortimen: string;
    koordinat_x?: number | string;
    koordinat_y?: number | string;
}

export interface LHCBarcodeType {
    id: string;
    barcode: string;
    lhc_id: string;
}


export interface KabupatenType {
    id: string;
    nama: string;
    propinsi_id: string;
    propinsi?: string;
}

export interface BlokType {
    id?: string | null;
    nama: string;
    tahun: TahunKegiatanType;
}

export interface BlokInType {
    id?: string | null;
    nama: string;
    tahun_id?: string | null;
}

export interface PetakType {
    id?: string;
    nama: string;
    blok: BlokType;
    luas?: number | null;
}

export interface PetakInType {
    id?: string | null;
    nama: string;
    blok_id?: string | null;
    luas?: number | null;
}


export interface TPKType {
    id: string;
    nama: string;
    kategori: number;
    alamat?: string | null;
}

export interface TPKInType {
    id?: string | null;
    nama: string;
    kategori: number;
    alamat?: string | null;
}


export interface TPnType {
    id: string;
    nama: string;
    blok: BlokType;
}

export interface TPnInType {
    id?: string | null;
    nama: string;
    blok_id?: string | null;
}

export interface JabatanGanisType {
    id: string;
    nama: string;
}

export interface GanisType {
    id: string;
    nama: string;
    jabatan: JabatanGanisType;
    berlaku_dari: string;
    berlaku_sampai: string;
}


export interface GanisInType {
    id?: string | null;
    nama: string;
    jabatan_id: string | null;
    berlaku_dari?: string | null;
    berlaku_sampai?: string | null;
}

export interface DKBAngkutanType {
    id: string;
    nomor_dkb: string;
    tanggal: string;
    alat_angkut: number;
    nomor_dokumen?: string;
    tpk_asal: TPKType;
    tpk_tujuan: TPKType;
    nama_alat_angkut?: string;
    dokumen_url?: string;
    barcodes?: string[];
}


export interface DKBAngkutanInType {
    id?: string | null;
    nomor_dkb: string;
    tanggal: string;
    alat_angkut: number;
    nomor_dokumen?: string;
    tpk_asal_id?: string;
    tpk_tujuan_id?: string;
    nama_alat_angkut?: string;
    dokumen_url?: string;
}


export interface UploadBarcodeLHCType {
    lhc_id: string;
    file_url: string;
}


export interface SaveLHCBarcodeType {
    lhc_id: string;
    barcodes: [
        {
            barcode: string;
            id?: string;
            no?: string;
        }
    ];
}

export interface DraftSpreadsheetType {
    id?: string | null;
    title: string;
    object: string;
    object_id: string;
    file_url: string;
    version: number;
}


