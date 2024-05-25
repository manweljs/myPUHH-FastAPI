"use client";
import Navbar from '@/components/navbar/Navbar';
import { UserProvider, useUserContext } from '@/hooks/UserContext';
import { ConfigProvider, theme } from 'antd';
import React, { useEffect } from 'react'
import { registerLicense } from '@syncfusion/ej2-base';
import { PRIMARY_COLOR } from '@/consts';
import AntdStyleRegistry from '@/hooks/AntdStyleRegistry';

interface Props {
    children: React.ReactNode;
    syncfusionKey?: string;
    accessToken?: string;
}




export function APP({ children, accessToken, syncfusionKey }: Props) {
    return (
        <UserProvider>
            <AntdStyleRegistry>
                <Wrapper accessToken={accessToken} syncfusionKey={syncfusionKey}>
                    {children}
                </Wrapper>
            </AntdStyleRegistry>
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

    useEffect(() => {
        // Menentukan path berdasarkan tema
        const themeStyle = userTheme === 'dark' ? 'material3-dark' : 'material3';

        // Dynamic imports berdasarkan tema
        import(`@/styles/${themeStyle}/individual-scss/spreadsheet/spreadsheet.css`);

    }, [userTheme]);

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