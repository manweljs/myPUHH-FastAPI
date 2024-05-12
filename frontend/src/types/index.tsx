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
    id?: string;
    tahun: string;
    nomor: string;
    tanggal: string;
    obyek: number;
}

export interface RencanaTebangType {
    id?: string;
    nomor: string;
    tahun_id: string | null;
    obyek: number;
    tanggal: string;
    faktor: number;
}

export interface UploadBarcodeType {
    lhc_id: string,
    file_url: string
}

export interface LHCType {
    id?: string;
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
    tahun_id: string;
}

export interface PohonType {
    id: string,
    nomor: string
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