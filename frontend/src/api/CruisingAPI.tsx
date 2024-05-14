import { API_URL } from "@/consts"
import { sendRequest } from "./Main"
import { LHCInType, LHCType, UploadBarcodeLHCType } from "@/types"


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

export const CreateLHC = async (data: LHCInType) => {
    const endpoint = `${API_URL}/api/Cruising/LHC`
    const method = "POST"
    return await sendRequest(endpoint, method, data)

}

export const UpdateLHC = async (data: LHCInType, id: string) => {
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


export const GetAllBarcode = async () => {
    const endpoint = `${API_URL}/api/Cruising/Barcode/GetAll`
    const method = "GET"
    return await sendRequest(endpoint, method)
}

export const GetBarcodesByLHC = async (id: string) => {
    const endpoint = `${API_URL}/api/Cruising/LHC/GetBarcode/${id}/All`
    const method = "GET"
    return await sendRequest(endpoint, method)
}

export const UploadBarcodeLHC = async (data: UploadBarcodeLHCType) => {
    const endpoint = `${API_URL}/api/Cruising/UploadBarcode`
    const method = "POST"
    return await sendRequest(endpoint, method, data)
}