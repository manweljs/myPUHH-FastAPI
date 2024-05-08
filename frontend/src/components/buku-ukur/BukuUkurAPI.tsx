import { getToken } from "functions"
import { HOST } from "index"



export const GetAllBukuUkur = async () => {
    const endpoint = HOST + `api/lhp/BukuUkur`
    const method = "GET"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const GetBukuUkur = async (id:string) => {
    const endpoint = HOST + `api/lhp/BukuUkur?pk=` + id
    const method = "GET"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const CreateBukuUkur = async (data:any) => {
    const endpoint = HOST + `api/lhp/BukuUkur`
    const method = "POST"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers, body: data })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const UpdateBukuUkur = async (data:any, id:string) => {
    const endpoint = HOST + `api/lhp/BukuUkur?pk=` + id
    const method = "PUT"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers, body: data })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const DeleteBukuUkur = async (id:string) => {
    const endpoint = HOST + `api/lhp/BukuUkur?pk=` + id
    const method = "DELETE"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const GetDKBBukuUkur = async (id:string, page:number) => {
    const endpoint = HOST + `api/lhp/DKBBukuUkur?pk=${id}&page=${page}`
    const method = "GET"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response
}

export const UploadDKBBukuUkur = async (data:any, id:string) => {
    const endpoint = HOST + `api/lhp/UploadDKBBukuUkur?pk=` + id
    const method = "POST"
    const headers = {
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers, body: data })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response
}

export const GetBarcodeForTebangan = async (id:string) => {
    const endpoint = HOST + `api/lhp/GetBarcodeForTebangan?pk=` + id
    const method = "PUT"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response
}

