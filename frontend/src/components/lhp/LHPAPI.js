import { getToken } from "functions"
import { HOST } from "index"


export const GetAllLHP = async () => {
    const endpoint = HOST + `api/LHP`
    const method = "GET"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const GetLHP = async (id) => {
    const endpoint = HOST + `api/LHP?pk=` + id
    const method = "GET"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}

export const CreateLHP = async (data) => {
    const endpoint = HOST + `api/LHP`
    const method = "POST"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers, body: data })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response
}

export const UpdateLHP = async (data, id) => {
    const endpoint = HOST + `api/LHP?pk=` + id
    const method = "PUT"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers, body: data })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response
}

export const DeleteLHP = async (id) => {
    const endpoint = HOST + `api/LHP?pk=` + id
    const method = "DELETE"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response
}
