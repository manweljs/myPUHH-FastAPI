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