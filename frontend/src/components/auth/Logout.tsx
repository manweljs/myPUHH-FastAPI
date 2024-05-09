"use client";
import { ACCESS_TOKEN_KEY } from '@/consts';
import { useUserContext } from '@/hooks/UserContext'
import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import cookie from "react-cookies"
import style from "./auth.module.sass"

const page = "Logout"

export default function Logout() {
    const { setPage, navigate } = useUserContext()
    const [loading, setLoading] = useState<boolean>(false)

    const handleLogout = () => {
        setLoading(true)
        cookie.remove(ACCESS_TOKEN_KEY)
        window.location.href = "/"
    }

    useEffect(() => {
        setPage(page);
    }, []);


    return (
        <div className={style.logout}>
            <div className={style.logout_form} >
                <h1>
                    Anda yakin ingin keluar ?
                </h1>
                <Button onClick={handleLogout} loading={loading}>Keluar</Button>
            </div>
        </div>
    )
}
