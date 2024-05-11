import { TahunKegiatanType } from "@/types";
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