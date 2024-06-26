import { getToken } from "@/functions";

export const sendRequest = async (url: string, method: string, data?: any) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
    // Ciptakan objek konfigurasi dengan 'method' dan 'headers'
    const options: RequestInit = { method, headers };

    // console.log('data to save -------->', data)
    // Tambahkan 'body' hanya jika 'data' ada dan metode bukan 'GET' atau 'HEAD'
    if (data && !(method === 'GET' || method === 'HEAD')) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    console.log('response', response)
    const result = await response.json();
    return result;

};


export const sendRequestCustomHeaders = async (url: string, method: string, headers: any, body?: any,) => {
    const response = await fetch(url, { method, headers, body: JSON.stringify(body) });
    const result = await response.json();
    return result;
}

export const sendPublicRequest = async (url: string, method: string, body?: any) => {
    const headers = {
        'Content-Type': 'application/json'
    }

    try {
        const response = await fetch(url, { method, headers, body: JSON.stringify(body) });
        const result = await response.json();
        return result;

    } catch (error) {
        console.log('error', error)
    }
}