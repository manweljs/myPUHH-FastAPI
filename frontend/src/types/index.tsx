export type User = {
    id: number;
    username: string;
    email: string;
    role: string;
    perusahaan: Perusahaan;

}

export type Perusahaan = {
    id: number;
    nama: string;
    alamat: string;
    logo: string;

}


export interface TahunKegiatanType {
    id: string;
    tahun: number;
    tanggal_mulai: string;
    tanggal_selesai: string;
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
