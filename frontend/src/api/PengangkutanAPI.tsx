import { API_URL } from "@/consts"
import { sendRequest } from "./Main"

export const GetAllDKBAngkutan = async () => {
    const endpoint = `${API_URL}/api/Angkutan/DKBAngkutan/GetAll`
    const method = "GET"
    return await sendRequest(endpoint, method)
}

export const GetDKBAngkutan = async (id: string) => {
    const endpoint = `${API_URL}/api/Angkutan/DKBAngkutan/${id}`
    const method = "GET"
    return await sendRequest(endpoint, method)
}

export const CreateDKBAngkutan = async (data: any) => {
    const endpoint = `${API_URL}/api/Angkutan/DKBAngkutan`
    const method = "POST"
    return await sendRequest(endpoint, method, data)
}

export const UpdateDKBAngkutan = async (data: any, id: string) => {
    const endpoint = `${API_URL}/api/Angkutan/DKBAngkutan/${id}`
    const method = "PUT"
    return await sendRequest(endpoint, method, data)
}

export const DeleteDKBAngkutan = async (id: string) => {
    const endpoint = `${API_URL}/api/Angkutan/DKBAngkutan/${id}`
    const method = "DELETE"
    return await sendRequest(endpoint, method)
}