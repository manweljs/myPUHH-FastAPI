import { API_URL } from "@/consts";
import { sendPublicRequest, sendRequest } from "./Main";

export const LoginUser = async (username: string, password: string) => {
    console.log('API_URL', API_URL)
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


export const GetUser = async () => {
    const endpoint = `${API_URL}/api/Account/User`;
    const method = "GET"
    return await sendRequest(endpoint, method);
}