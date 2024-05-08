"use client";
import Navbar from '@/components/navbar/Navbar';
import { UserProvider, useUserContext } from '@/hooks/UserContext';
import { ConfigProvider } from 'antd';
import React from 'react'

interface Props {
    children: React.ReactNode;
    accessToken?: string;
}

export function APP({ children, accessToken }: Props) {
    return (
        <UserProvider>
            <ConfigProvider>
                <Wrapper accessToken={accessToken}>
                    <Navbar />
                    {children}
                </Wrapper>
            </ConfigProvider>
        </UserProvider>
    )
}


const Wrapper = ({ children, accessToken }: Props) => {
    const { minimizeSidebar } = useUserContext()
    let className = minimizeSidebar ? "min" : ""
    accessToken ? (className += " has-navbar") : (className += " public")

    console.log('minimizeSidebar', minimizeSidebar)
    return (
        <body className={className} >
            {children}
        </body>
    )
}