import { ACCESS_TOKEN_KEY } from "@/consts";
import { JenisPohonType } from "@/types";
import cookie from "react-cookies"

export const getToken = (token_key = ACCESS_TOKEN_KEY) => {
    return cookie.load(token_key);
}

// Fungsi untuk mengubah string menjadi Title Case
export function toTitleCase(str: string): string {
    return str.toLowerCase().replace(/_/g, ' ').replace(/\b(\w)/g, s => s.toUpperCase());
}

export const sanitizeFilename = (filename: string): string => {
    return filename.replace(/[^a-zA-Z0-9]/g, '_');
};

export function createOptionsFromEnum(enumObject: any): { value: number, label: string }[] {
    return Object.entries(enumObject)
        .filter(([key, value]) => typeof value === 'number') // Filter untuk mendapatkan hanya key yang memiliki value berupa angka
        .map(([key, value]) => ({
            value: value as number,
            label: toTitleCase(key) // Menggunakan fungsi toTitleCase untuk mengubah label
        }));
}

// Fungsi untuk mendapatkan string label dari nilai enum
export function getEnumLabel(enumObject: any, value: number): string {
    const entry = Object.entries(enumObject).find(([key, enumValue]) => enumValue === value && typeof enumValue === 'number');
    if (entry) {
        return toTitleCase(entry[0]);
    }
    return 'Unknown'; // Nilai default jika tidak ditemukan
}



export function getKelasDiameterId(val: number): number {
    if (val < 30) {
        return 1;
    } else if (val < 40) {
        return 2;
    } else if (val < 50) {
        return 3;
    } else if (val < 60) {
        return 4;
    } else {
        return 5;
    }
}



export function getJenisId(jenis: string, listJenis: JenisPohonType[]): number | null {
    return listJenis.find(j => j.nama === jenis)?.id || null;
}
