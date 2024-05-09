import { API_URL } from "@/consts"
import { sendRequest } from "./Main"
import { RencanaTebangType, UploadBarcodeType } from "@/types"


export const GetAllRencanaTebang = async () => {
    const endpoint = `${API_URL}/api/Cruising/RencanaTebang/GetAll`
    const method = "GET"
    return await sendRequest(endpoint, method)

}

export const GetRencanaTebang = async (id: string) => {
    const endpoint = `${API_URL}/api/Cruising/RencanaTebang/${id}`
    const method = "GET"
    return await sendRequest(endpoint, method)
}

export const CreateRencanaTebang = async (data: RencanaTebangType) => {
    const endpoint = `${API_URL}/api/Cruising/RencanaTebang`
    const method = "POST"
    return await sendRequest(endpoint, method, data)

}

export const UploadBarcodeRencanaTebang = async (data: UploadBarcodeType) => {
    const endpoint = `${API_URL}/api/Cruising/UploadBarcode`
    const method = "POST"
    return await sendRequest(endpoint, method, data)

}

export const UpdateRencanaTebang = async (data: RencanaTebangType, id: string) => {
    const endpoint = `${API_URL}/api/Cruising/RencanaTebang/${id}`
    const method = "PUT"
    return await sendRequest(endpoint, method, data)

}

export const DeleteRencanaTebang = async (id: string) => {
    const endpoint = `${API_URL}/api/Cruising/RencanaTebang/${id}`
    const method = "DELETE"
    return await sendRequest(endpoint, method)

}


export const ImportPohonRencanaTebang = async (data: any) => {
    const endpoint = `${API_URL}/api/Cruising/ImportPohonRencanaTebang`
    const method = "POST"
    return await sendRequest(endpoint, method, data)
}

