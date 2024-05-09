import { API_URL } from "@/consts"
import { sendRequest } from "./Main"
import { LHCType } from "@/types"


export const GetAllLHC = async () => {
    const endpoint = `${API_URL}/api/Cruising/LHC/GetAll`
    const method = "GET"
    return await sendRequest(endpoint, method)

}

export const GetLHC = async (id: string) => {
    const endpoint = `${API_URL}/api/Cruising/LHC/${id}`
    const method = "GET"
    return await sendRequest(endpoint, method)

}

export const CreateLHC = async (data: LHCType) => {
    const endpoint = `${API_URL}/api/Cruising/LHC`
    const method = "POST"
    return await sendRequest(endpoint, method, data)

}

export const UpdateLHC = async (data: LHCType, id: string) => {
    const endpoint = `${API_URL}/api/Cruising/LHC/${id}`
    const method = "PUT"
    return await sendRequest(endpoint, method, data)

}

export const DeleteLHC = async (id: string) => {
    const endpoint = `${API_URL}/api/Cruising/LHC/${id}`
    const method = "DELETE"
    return await sendRequest(endpoint, method)

}

export const GetLHCDetails = async (id: string, page: number) => {
    const endpoint = `${API_URL}/api/Cruising/LHC/GetDetails/${id}?page=${page}`
    const method = "GET"
    return await sendRequest(endpoint, method)

}

export const ImportPohonLHC = async (data: any, id: string) => {
    const endpoint = `${API_URL}/api/Cruising/ImportPohonLHC/${id}`
    const method = "POST"
    return await sendRequest(endpoint, method, data)
}

