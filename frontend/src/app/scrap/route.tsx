import { GetNomorDokumen } from '@/utils/pupetteer/GetNomorDokumen';

const username = "UM-MIM-KELAY"
const password = "Manwel12345"

export async function GET() {
    const response = await GetNomorDokumen(username, password)
    return response
}
