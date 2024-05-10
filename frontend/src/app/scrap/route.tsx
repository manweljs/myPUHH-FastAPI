import { GetNomorDokumen } from '@/utils/pupetteer/GetNomorDokumen';


export async function GET() {
    const username = process.env.SIPUHH_USERNAME
    const password = process.env.SIPUHH_PASSWORD

    if (!username || !password) {
        throw new Error('Username atau password belum diatur')
    }
    const response = await GetNomorDokumen(username, password)
    return response
}
