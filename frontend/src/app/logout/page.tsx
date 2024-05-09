import React from 'react'
import dynamic from 'next/dynamic'

const Logout = dynamic(() => import('@/components/auth/Logout'), { ssr: false })
export default function Page() {

    return (
        <Logout />
    )
}
