import { API_URL } from "@/consts"
import { sendRequest } from "./Main"
import { DraftSpreadsheetType } from "@/types"

const SaveDraftSpreadsheet = async (data: DraftSpreadsheetType) => {
    const endpoint = `${API_URL}/api/Spreadsheet/Draft`
    const method = "PUT"
    return await sendRequest(endpoint, method, data)
}