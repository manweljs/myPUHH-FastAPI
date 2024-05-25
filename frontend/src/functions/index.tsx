import { ACCESS_TOKEN_KEY } from "@/consts";
import { JenisPohonType, LHCType, PetakType, SortimenType } from "@/types";
import { message } from "antd";
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



export function getJenisId(jenis: string, listJenis: JenisPohonType[]): number {
    console.log('jenis', jenis);
    const foundJenis = listJenis.find(j => j.nama === jenis);

    if (!foundJenis) {
        throw new Error(`Jenis  ${jenis} tidak ditemukan.`);
    }

    return foundJenis.id;
}


export function getPetakId(petak: string, listPetak: PetakType[], tahun: number): string {
    const foundPetak = listPetak.find(p => p.nama === petak && p.tahun === tahun);

    if (!foundPetak) {
        throw new Error(`Petak dengan nama ${petak} untuk tahun ${tahun} tidak ditemukan.`);
    }

    return foundPetak.id;
}

export function getSortimenId(diameter: number) {
    if (diameter < 30) {
        return 3
    } else if (diameter < 50) {
        return 2
    } else {
        return 1
    }
}

export function getStatusPohonId(diameter: number, jenis: string, listJenis: JenisPohonType[], obyek?: number) {
    if (obyek === 1) {
        return 2
    }
    const kelompok_jenis = listJenis.find(j => j.nama === jenis)!.kelompok_jenis.id as number;
    if (kelompok_jenis === 4) {
        return 3
    }
    if (diameter < 40) {
        return 1
    } else if (diameter >= 40) {
        return 2
    }
    return null
}

export function chunkArray(array: any, size: number) {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
        chunked_arr.push(array.slice(index, size + index));
        index += size;
    }
    return chunked_arr;
}