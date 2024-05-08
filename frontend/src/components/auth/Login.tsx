"use client";
import React, { useEffect, useState } from 'react'
import "./auth.css"
import { Button, Input, notification } from 'antd'
import cookie from "react-cookies"
import { GetPerusahaan, LoginUser } from '@/api'
import { getToken } from '@/functions'
import { useUserContext } from '@/hooks/UserContext'
import { ACCESS_TOKEN_KEY } from '@/consts';


const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

export default function Login() {
    const { setPerusahaan, navigate } = useUserContext()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const accessToken = getToken()
    const [api, contextHolder] = notification.useNotification()


    const handleLogin = async () => {
        setLoading(true)
        try {
            const response = await LoginUser(username, password)
            console.log(response)
            if (response.access_token) {
                const token = response.access_token
                cookie.save(ACCESS_TOKEN_KEY, token, { path: '/', expires: expires })
                navigate("/")
            } else {
                setError(response.message)
                api.error({
                    message: response.detail
                })
            }

        } catch (error) {
            setLoading(false)
            console.log(error)
        }

        setLoading(false)

    }

    useEffect(() => {
        if (accessToken) {
            navigate("/")
        }
    }, [accessToken])

    return (
        <div className="login">
            {contextHolder}
            <div className="login-form">
                <div className="title is-text-primary">myPUHH</div>
                {error &&
                    <div className="login-err">{error}</div>
                }
                <div className="field">
                    <div className="label" >Username</div>
                    <Input onChange={e => setUsername(e.target.value)} value={username} />
                </div>
                <div className="field">
                    <div className="label">Password</div>
                    <Input.Password onChange={e => setPassword(e.target.value)} value={password} />
                </div>

                <Button
                    loading={loading}
                    type='primary'
                    onClick={handleLogin}>Login</Button>
            </div>
        </div>
    )
}
