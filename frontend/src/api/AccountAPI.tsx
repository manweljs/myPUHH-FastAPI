import { API_URL } from "@/consts";
import { sendPublicRequest, sendRequest } from "./Main";
import { PerusahaanInType } from "@/types";

export const LoginUser = async (username: string, password: string) => {
    const endpoint = `${API_URL}/api/Account/Login`;
    const method = "POST"
    const body = { username, password };
    return await sendPublicRequest(endpoint, method, body);
}

export const GetPerusahaan = async () => {
    const endpoint = `${API_URL}/api/Account/Perusahaan`;
    const method = "GET"
    return await sendRequest(endpoint, method);
}

export const UpdatePerusahaan = async (data: PerusahaanInType) => {
    const endpoint = `${API_URL}/api/Account/Perusahaan`;
    const method = "PUT"
    return await sendRequest(endpoint, method, data);
}

export const GetUser = async () => {
    const endpoint = `${API_URL}/api/Account/User`;
    const method = "GET"
    return await sendRequest(endpoint, method);
}