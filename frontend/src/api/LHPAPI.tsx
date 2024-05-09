import { API_URL } from "@/consts"
import { sendRequest } from "./Main"

export const GetAllLHP = async () => {
    const endpoint = `${API_URL}/api/Produksi/LHP/GetAll`
    const method = "GET"
    return await sendRequest(endpoint, method)

}

export const GetLHP = async (id: string) => {
    const endpoint = `${API_URL}/api/Produksi/LHP/${id}`
    const method = "GET"
    return await sendRequest(endpoint, method)

}

export const CreateLHP = async (data: any) => {
    const endpoint = `${API_URL}/api/Produksi/LHP`
    const method = "POST"
    return await sendRequest(endpoint, method, data)
}

export const UpdateLHP = async (data: any, id: string) => {
    const endpoint = `${API_URL}/api/Produksi/LHP/${id}`
    const method = "PUT"
    return await sendRequest(endpoint, method, data)
}

export const DeleteLHP = async (id: string) => {
    const endpoint = `${API_URL}/api/Produksi/LHP/${id}`
    const method = "DELETE"
    return await sendRequest(endpoint, method)
}
