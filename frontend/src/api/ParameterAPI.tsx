import { BlokInType, PetakInType, TahunKegiatanType, TPKInType } from "@/types";
import { sendRequest } from "./Main";
import { API_URL } from "@/consts";

export const CreateTahunKegiatan = async (data: TahunKegiatanType) => {
    const endpoint = `${API_URL}/api/Parameter/TahunKegiatan/`;
    const method = 'POST';
    return await sendRequest(endpoint, method, data);

}

export const GetAllTahunKegiatan = async () => {
    const endpoint = `${API_URL}/api/Parameter/TahunKegiatan/GetAll`;
    const method = 'GET';
    return await sendRequest(endpoint, method);

}

export const GetTahunKegiatan = async (id: string) => {
    const endpoint = `${API_URL}/api/Parameter/TahunKegiatan/${id}`;
    const method = 'GET';
    return await sendRequest(endpoint, method);

}

export const UpdateTahunKegiatan = async (data: TahunKegiatanType, id: string) => {
    const endpoint = `${API_URL}/api/Parameter/TahunKegiatan/${id}`;
    const method = 'PUT';
    return await sendRequest(endpoint, method, data);

}

export const DeleteTahunKegiatan = async (id: string) => {
    const endpoint = `${API_URL}/api/Parameter/TahunKegiatan/${id}`;
    const method = 'DELETE';
    return await sendRequest(endpoint, method);

}


export const CreateBlok = async (data: BlokInType) => {
    const endpoint = `${API_URL}/api/Parameter/Blok/`;
    const method = 'POST';
    return await sendRequest(endpoint, method, data);
}

export const GetAllBlok = async () => {
    const endpoint = `${API_URL}/api/Parameter/Blok/GetAll`;
    const method = 'GET';
    return await sendRequest(endpoint, method);

}

export const GetBlok = async (id: string) => {
    const endpoint = `${API_URL}/api/Parameter/Blok/${id}`;
    const method = 'GET';
    return await sendRequest(endpoint, method);

}

export const UpdateBlok = async (data: BlokInType, id: string) => {
    const endpoint = `${API_URL}/api/Parameter/Blok/${id}`;
    const method = 'PUT';
    return await sendRequest(endpoint, method, data);

}

export const DeleteBlok = async (id: string) => {
    const endpoint = `${API_URL}/api/Parameter/Blok/${id}`;
    const method = 'DELETE';
    return await sendRequest(endpoint, method);

}


export const CreatePetak = async (data: PetakInType) => {
    const endpoint = `${API_URL}/api/Parameter/Petak/`;
    const method = 'POST';
    return await sendRequest(endpoint, method, data);
}

export const GetAllPetak = async () => {
    const endpoint = `${API_URL}/api/Parameter/Petak/GetAll`;
    const method = 'GET';
    return await sendRequest(endpoint, method);

}

export const GetPetak = async (id: string) => {
    const endpoint = `${API_URL}/api/Parameter/Petak/${id}`;
    const method = 'GET';
    return await sendRequest(endpoint, method);

}

export const UpdatePetak = async (data: PetakInType, id: string) => {
    const endpoint = `${API_URL}/api/Parameter/Petak/${id}`;
    const method = 'PUT';
    return await sendRequest(endpoint, method, data);

}

export const DeletePetak = async (id: string) => {
    const endpoint = `${API_URL}/api/Parameter/Petak/${id}`;
    const method = 'DELETE';
    return await sendRequest(endpoint, method);

}


export const CreateTPK = async (data: TPKInType) => {
    const endpoint = `${API_URL}/api/Parameter/TPK/`;
    const method = 'POST';
    return await sendRequest(endpoint, method, data);
}

export const GetAllTPK = async () => {
    const endpoint = `${API_URL}/api/Parameter/TPK/GetAll`;
    const method = 'GET';
    return await sendRequest(endpoint, method);

}

export const GetTPK = async (id: string) => {
    const endpoint = `${API_URL}/api/Parameter/TPK/${id}`;
    const method = 'GET';
    return await sendRequest(endpoint, method);

}

export const UpdateTPK = async (data: TPKInType, id: string) => {
    const endpoint = `${API_URL}/api/Parameter/TPK/${id}`;
    const method = 'PUT';
    return await sendRequest(endpoint, method, data);

}


export const DeleteTPK = async (id: string) => {
    const endpoint = `${API_URL}/api/Parameter/TPK/${id}`;
    const method = 'DELETE';
    return await sendRequest(endpoint, method);

}