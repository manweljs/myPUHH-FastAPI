"use client";
import React, { useEffect, useState } from 'react'
import style from "./auth.module.sass"
import { Button, Form, Input, notification } from 'antd'
import cookie from "react-cookies"
import { GetPerusahaan, LoginUser } from '@/api'
import { getToken } from '@/functions'
import { useUserContext } from '@/hooks/UserContext'
import { ACCESS_TOKEN_KEY } from '@/consts';
import { Field } from '@/components/global';


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
                window.location.href = "/"
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
        <div className={style.login}>
            {contextHolder}
            <div className={style.login_form}>
                <div className="title is-text-primary">myPUHH</div>
                {error &&
                    <div className={style.login_error}>{error}</div>
                }

                <Form layout='vertical'>
                    <Field
                        type='char'
                        name='username'
                        onChange={e => setUsername(e.target.value)}
                        value={username}
                        required={true}
                    />

                    <Field
                        type='password'
                        name='password'
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        required
                    />

                    <Button
                        loading={loading}
                        type='primary'
                        onClick={handleLogin}>Login
                    </Button>

                </Form>
            </div>
        </div>
    )
}
