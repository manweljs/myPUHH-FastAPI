import { API_URL } from "@/consts"
import { sendRequest } from "./Main"
import { LHCInType, LHCPohonInType, LHCPohonSaveDatabaseType, LHCType, SaveLHCBarcodeType, UploadBarcodeLHCType } from "@/types"


export const GetAllLHC = async () => {
    const endpoint = `${API_URL}/api/Cruising/LHC/GetAll`
    const method = "GET"
    return await sendRequest(endpoint, method)

}

export const GetLHC = async (lhc_id: string) => {
    const endpoint = `${API_URL}/api/Cruising/LHC/${lhc_id}`
    const method = "GET"
    return await sendRequest(endpoint, method)

}

export const CreateLHC = async (data: LHCInType) => {
    const endpoint = `${API_URL}/api/Cruising/LHC`
    const method = "POST"
    return await sendRequest(endpoint, method, data)

}

export const UpdateLHC = async (data: LHCInType, lhc_id: string) => {
    const endpoint = `${API_URL}/api/Cruising/LHC/${lhc_id}`
    const method = "PUT"
    return await sendRequest(endpoint, method, data)

}

export const DeleteLHC = async (lhc_id: string) => {
    const endpoint = `${API_URL}/api/Cruising/LHC/${lhc_id}`
    const method = "DELETE"
    return await sendRequest(endpoint, method)

}

export const GetLHCDetails = async (lhc_id: string, page: number) => {
    const endpoint = `${API_URL}/api/Cruising/LHC/GetDetails/${lhc_id}?page=${page}`
    const method = "GET"
    return await sendRequest(endpoint, method)

}

export const GetAllPohonByLHC = async (lhc_id: string) => {
    const endpoint = `${API_URL}/api/Cruising/LHC/${lhc_id}/Pohon/GetAll`
    const method = "GET"
    return await sendRequest(endpoint, method)

}

export const ImportPohonLHC = async (data: any, lhc_id: string) => {
    const endpoint = `${API_URL}/api/Cruising/ImportPohonLHC/${lhc_id}`
    const method = "POST"
    return await sendRequest(endpoint, method, data)
}


export const GetAllBarcode = async () => {
    const endpoint = `${API_URL}/api/Cruising/Barcode/GetAll`
    const method = "GET"
    return await sendRequest(endpoint, method)
}

export const GetBarcodesByLHC = async (lhc_id: string) => {
    const endpoint = `${API_URL}/api/Cruising/LHC/${lhc_id}/GetBarcode/All`
    const method = "GET"
    return await sendRequest(endpoint, method)
}

export const UploadBarcodeLHC = async (data: UploadBarcodeLHCType) => {
    const endpoint = `${API_URL}/api/Cruising/UploadBarcode`
    const method = "POST"
    return await sendRequest(endpoint, method, data)
}

export const SaveLHCBarcode = async (lhc_id: string, data: SaveLHCBarcodeType) => {
    const endpoint = `${API_URL}/api/Cruising/LHC/${lhc_id}/SaveBarcode`
    const method = "PUT"
    return await sendRequest(endpoint, method, data)
}


export const SaveLHCPohon = async (lhc_id: string, data: LHCPohonSaveDatabaseType[]) => {
    const endpoint = `${API_URL}/api/Cruising/LHC/${lhc_id}/Pohon/Save`
    const method = "PUT"
    return await sendRequest(endpoint, method, data)
}

export const GetRekapitulasiLHC = async (lhc_id: string) => {
    const endpoint = `${API_URL}/api/Cruising/LHC/${lhc_id}/Rekapitulasi`
    const method = "GET"
    return await sendRequest(endpoint, method)
}


export const SaveBarcodeRencanaTebang = async (rencana_tebang_id: string, data: any) => {
    const endpoint = `${API_URL}/api/Cruising/RencanaTebang/${rencana_tebang_id}/Barcode/Save`
    const method = "PUT"
    return await sendRequest(endpoint, method, data)
}

export const GetBarcodeRencanaTebang = async (rencana_tebang_id: string) => {
    const endpoint = `${API_URL}/api/Cruising/RencanaTebang/${rencana_tebang_id}/Barcode/GetAll`
    const method = "GET"
    return await sendRequest(endpoint, method)
}

export const SetRencanaTebangTarget = async (rencana_tebang_id: string) => {
    const endpoint = `${API_URL}/api/Cruising/RencanaTebang/${rencana_tebang_id}/SetTarget`
    const method = "PUT"
    return await sendRequest(endpoint, method)
}