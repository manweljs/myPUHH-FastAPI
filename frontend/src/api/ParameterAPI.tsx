import { TahunKegiatan } from "@/types";
import { sendRequest } from "./Main";

export const CreateTahunKegiatan = async (data: TahunKegiatan) => {
    const method = 'POST';
    return await sendRequest(`/Parameter/TahunKegiatan`, method, data);

}

export const GetAllTahunKegiatan = async () => {
    const method = 'GET';
    return await sendRequest(`/Parameter/TahunKegiatan/GetAll`, method);

}

export const GetTahunKegiatan = async (id: string) => {
    const method = 'GET';
    return await sendRequest(`/Parameter/TahunKegiatan/${id}`, method);

}

export const UpdateTahunKegiatan = async (data: TahunKegiatan) => {
    const method = 'PUT';
    return await sendRequest(`/Parameter/TahunKegiatan`, method, data);

}

export const DeleteTahunKegiatan = async (id: string) => {
    const method = 'DELETE';
    return await sendRequest(`/Parameter/TahunKegiatan/${id}`, method);

}