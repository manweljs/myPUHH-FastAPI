"use client";
import Navbar from '@/components/navbar/Navbar';
import { UserProvider, useUserContext } from '@/hooks/UserContext';
import { ConfigProvider } from 'antd';
import React, { useEffect } from 'react'
import { registerLicense } from '@syncfusion/ej2-base';


interface Props {
    children: React.ReactNode;
    syncfusionKey?: string;
    accessToken?: string;
}




export function APP({ children, accessToken, syncfusionKey }: Props) {


    return (
        <UserProvider>
            <ConfigProvider>
                <Wrapper accessToken={accessToken} syncfusionKey={syncfusionKey}>
                    {children}
                </Wrapper>
            </ConfigProvider>
        </UserProvider>
    )
}


const Wrapper = ({ children, accessToken, syncfusionKey }: Props) => {
    const { minimizeSidebar } = useUserContext()

    useEffect(() => {
        syncfusionKey && registerLicense(syncfusionKey)

    }, [syncfusionKey]);

    let className = minimizeSidebar ? "min" : ""
    accessToken ? (className += " has-navbar") : (className += " public")

    console.log('minimizeSidebar', minimizeSidebar)
    return (
        <body className={className} >
            {accessToken &&
                <Navbar />
            }
            {children}
        </body>
    )
}