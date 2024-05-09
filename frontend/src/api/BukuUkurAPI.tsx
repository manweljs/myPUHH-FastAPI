import { API_URL } from "@/consts"
import { sendRequest } from "./Main"
import { BukuUkurType } from "@/types"

export const GetAllBukuUkur = async () => {
    const endpoint = `${API_URL}/api/Produksi/BukuUkur/GetAll`
    const method = "GET"
    return await sendRequest(endpoint, method)

}

export const GetBukuUkur = async (id: string) => {
    const endpoint = `${API_URL}/api/Produksi/BukuUkur/${id}`
    const method = "GET"
    return await sendRequest(endpoint, method)

}

export const CreateBukuUkur = async (data: BukuUkurType) => {
    const endpoint = `${API_URL}/api/Produksi/BukuUkur`
    const method = "POST"
    return await sendRequest(endpoint, method, data)

}

export const UpdateBukuUkur = async (data: BukuUkurType, id: string) => {
    const endpoint = `${API_URL}/api/Produksi/BukuUkur/${id}`
    const method = "PUT"
    return await sendRequest(endpoint, method, data)

}

export const DeleteBukuUkur = async (id: string) => {
    const endpoint = `${API_URL}/api/Produksi/BukuUkur/${id}`
    const method = "DELETE"
    return await sendRequest(endpoint, method)

}

export const GetDKBBukuUkur = async (id: string, page: number) => {
    const endpoint = `${API_URL}/api/Produksi/BukuUkur/GetDKB/${id}?page=${page}`
    const method = "GET"
    return await sendRequest(endpoint, method)
}

export const UploadDKBBukuUkur = async (data: any, id: string) => {
    const endpoint = `${API_URL}/api/Produksi/BukuUkur/UploadDKB/${id}`
    const method = "POST"
    return await sendRequest(endpoint, method, data)
}

export const GetBarcodeForTebangan = async (id: string) => {
    const endpoint = `${API_URL}/api/Produksi/BukuUkur/GetBarcodeForTebangan/${id}`
    const method = "PUT"
    return await sendRequest(endpoint, method)
}

