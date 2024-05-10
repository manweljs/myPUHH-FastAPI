"use client";
import Navbar from '@/components/navbar/Navbar';
import { UserProvider, useUserContext } from '@/hooks/UserContext';
import { ConfigProvider, theme } from 'antd';
import React, { useEffect } from 'react'
import { registerLicense } from '@syncfusion/ej2-base';
import { PRIMARY_COLOR } from '@/consts';


interface Props {
    children: React.ReactNode;
    syncfusionKey?: string;
    accessToken?: string;
}




export function APP({ children, accessToken, syncfusionKey }: Props) {


    return (
        <UserProvider>
            <Wrapper accessToken={accessToken} syncfusionKey={syncfusionKey}>
                {children}
            </Wrapper>
        </UserProvider>
    )
}


const Wrapper = ({ children, accessToken, syncfusionKey }: Props) => {
    const { minimizeSidebar, theme: userTheme } = useUserContext()

    useEffect(() => {
        syncfusionKey && registerLicense(syncfusionKey)

    }, [syncfusionKey]);

    let className = minimizeSidebar ? "min" : ""
    accessToken ? (className += " has-navbar") : (className += " public")

    console.log('minimizeSidebar', minimizeSidebar)
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: PRIMARY_COLOR,
                },
                algorithm: userTheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}
        >
            <body className={className} >
                {accessToken &&
                    <Navbar />
                }
                {children}
            </body>
        </ConfigProvider>
    )
}