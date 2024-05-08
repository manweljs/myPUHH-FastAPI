"use client";
import Navbar from '@/components/navbar/Navbar';
import { getToken } from '@/functions';
import { UserProvider, useUserContext } from '@/hooks/UserContext';
import { ConfigProvider } from 'antd';
import React, { useEffect } from 'react'

export function APP({ children, accessToken }: { children: React.ReactNode, accessToken?: string }) {

    return (
        <UserProvider>
            <ConfigProvider>
                <body className={accessToken ? "has-navbar" : "public"} >
                    <Navbar />
                    {children}
                </body>
            </ConfigProvider>
        </UserProvider>
    )
}
