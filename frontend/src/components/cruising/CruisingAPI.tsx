import { HOST } from "../.."
import { getToken } from "../../functions"


export const GetAllLHC = async () => {
    const endpoint = HOST + `api/lhc/LHC`
    const method = "GET"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const GetLHC = async (id: string) => {
    const endpoint = HOST + `api/lhc/LHC?pk=` + id
    const method = "GET"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const CreateLHC = async (data: any) => {
    const endpoint = HOST + `api/lhc/LHC`
    const method = "POST"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers, body: data })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const UpdateLHC = async (data: any, id: string) => {
    const endpoint = HOST + `api/lhc/LHC?pk=` + id
    const method = "PUT"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers, body: data })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const DeleteLHC = async (id: string) => {
    const endpoint = HOST + `api/lhc/LHC?pk=` + id
    const method = "DELETE"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const GetLHCDetails = async (id: string, page: number) => {
    const endpoint = HOST + `api/lhc/LHCDetail?pk=${id}&page=${page}`
    const method = "GET"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const ImportPohonLHC = async (data: any, id: string) => {
    const endpoint = HOST + `api/lhc/ImportPohonLHC?pk=` + id
    const method = "POST"
    const headers = {
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers, body: data })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response
}

