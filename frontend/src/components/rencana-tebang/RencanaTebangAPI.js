import { getToken } from "functions"
import { HOST } from "index"

export const GetAllRencanaTebang = async () => {
    const endpoint = HOST + `api/lhc/RencanaTebang`
    const method = "GET"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const GetRencanaTebang = async (id) => {
    const endpoint = HOST + `api/lhc/RencanaTebang?pk=` + id
    const method = "GET"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const CreateRencanaTebang = async (data) => {
    const endpoint = HOST + `api/lhc/RencanaTebang`
    const method = "POST"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers, body: data })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const UploadBarcodeRencanaTebang = async (data, pk) => {
    const endpoint = HOST + `api/lhc/RencanaTebang/UploadBarcode/?pk=${pk}`
    const method = "POST"
    const headers = {
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers, body: data })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const UpdateRencanaTebang = async (data, id) => {
    const endpoint = HOST + `api/lhc/RencanaTebang?pk=` + id
    const method = "PUT"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers, body: data })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const DeleteRencanaTebang = async (id) => {
    const endpoint = HOST + `api/lhc/RencanaTebang?pk=` + id
    const method = "DELETE"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const GetTarget = async (id, page) => {
    const endpoint = HOST + `api/lhc/RencanaTebang/Target?pk=${id}&page=${page}`
    const method = "GET"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const ImportPohonRencanaTebang = async (data, id) => {
    const endpoint = HOST + `api/lhc/ImportPohonRencanaTebang?pk=` + id
    const method = "POST"
    const headers = {
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers, body: data })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response
}

