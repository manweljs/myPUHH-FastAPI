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
    id: number;
    nama: string;
    alamat?: string;
    logo?: string;
    telepon?: string;
    kabupaten?: KabupatenType;
}

export type PerusahaanInType = {
    id: number;
    nama: string;
    alamat?: string;
    logo?: string;
    telepon?: string;
    kabupaten_id: string;
}

export interface TahunKegiatanType {
    id?: string;
    tahun: number;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
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
    tahun_id: string;
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

