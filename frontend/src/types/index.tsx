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


export interface TahunKegiatan {
    id: string;
    tahun: number;
    tanggal_mulai: string;
    tanggal_selesai: string;
}