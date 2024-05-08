import React from 'react'
import dynamic from 'next/dynamic'

const Login = dynamic(() => import('@/components/auth/Login'), { ssr: false })

export default function page() {
    return (
        <Login />
    )
}
