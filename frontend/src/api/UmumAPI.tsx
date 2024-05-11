import { getToken } from "@/functions"
import { API_URL } from "@/consts"
import { sendRequest } from "./Main"



export const UploadFile = async (file: any, filekey: string = "file") => {
    const endpoint = `${API_URL}/api/UploadFile/`
    const method = "POST"
    const headers = {
        "Authorization": `Bearer ${getToken()}`
    }
    const data = new FormData()
    data.append(filekey, file)
    return await fetch(endpoint, { method, headers, body: data })
}

export const GetAllKabupaten = async () => {
    const endpoint = `${API_URL}/api/Umum/Kabupaten`
    const method = "GET"

    return await sendRequest(endpoint, method)
}