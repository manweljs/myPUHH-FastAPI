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

export const UploadFileToAWS = async (file: any) => {

    const encodedContentType = encodeURIComponent(file.type)

    try {
        const { presigned } = await GetPresignedUrl(file.name, encodedContentType)

        const response = await fetch(presigned, {
            method: 'PUT',
            body: file // Langsung mengirim file sebagai body
        });
        if (response.ok) {
            console.log("File successfully uploaded to S3");
        } else {
            console.error("Failed to upload file", response);
            throw new Error("Failed to upload file")
        }

        return presigned

    } catch (error) {
        console.log('error', error)
        throw new Error((error as unknown as any).toString())
    }

}

export const GetAllKabupaten = async () => {
    const endpoint = `${API_URL}/api/Umum/Kabupaten`
    const method = "GET"

    return await sendRequest(endpoint, method)
}

export const GetPresignedUrl = async (filename: string, contentType: string) => {
    const endpoint = `${API_URL}/api/Umum/GetPresignedUrl?file_name=${filename}&content_type=${contentType}`
    const method = "GET"
    return await sendRequest(endpoint, method)
}

export const GetAllJabatanGanis = async () => {
    const endpoint = `${API_URL}/api/Umum/JabatanGanis`
    const method = "GET"

    return await sendRequest(endpoint, method)
}


export const GetAllJenis = async () => {
    const endpoint = `${API_URL}/api/Umum/Jenis`
    const method = "GET"

    return await sendRequest(endpoint, method)
}