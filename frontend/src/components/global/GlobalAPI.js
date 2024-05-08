import { getToken } from "functions"
import { HOST } from "index"

export const GetObyek = async () => {
    const endpoint = HOST + `api/Obyek`
    const method = "GET"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}


export const GetUser = async () => {
    const endpoint = HOST + `api/User`
    const method = "GET"
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    }

    const response = await fetch(endpoint, { method, headers })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response

}