import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import cookie from "react-cookies"
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../UserContext'

const page = "Logout"
document.title = page
export default function Logout() {
    const navigate = useNavigate()
    const { reset, setPage } = useUser()
    const [loading, setLoading] = useState<boolean>(false)

    const handleLogout = () => {
        setLoading(true)
        cookie.remove("ta_")
        reset()
        navigate("/login")
    }

    useEffect(() => {
        setPage(page);
    }, [setPage]);

    useEffect(() => {

    }, []);
    return (
        <div className="logout">
            <div className="logout-form" style={{ height: "100vh" }}>
                <h1>
                    Anda yakin ingin keluar ?
                </h1>
                <Button onClick={handleLogout} loading={loading}>Keluar</Button>
            </div>
        </div>
    )
}
