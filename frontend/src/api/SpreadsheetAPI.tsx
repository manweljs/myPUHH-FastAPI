import { API_URL } from "@/consts"
import { sendRequest } from "./Main"
import { DraftSpreadsheetType } from "@/types"

export const SaveDraftSpreadsheet = async (data: DraftSpreadsheetType) => {
    const endpoint = `${API_URL}/api/Spreadsheet/Draft/`
    const method = "PUT"
    return await sendRequest(endpoint, method, data)
}


export const GetDraftSpreadsheets = async (type: string, id:string, version:number = 1) => {
    const params = `?type=${type}&id=${id}&version=${version}`
    const endpoint = `${API_URL}/api/Spreadsheet/Draft/${params}`
    const method = "GET"
    return await sendRequest(endpoint, method)
}