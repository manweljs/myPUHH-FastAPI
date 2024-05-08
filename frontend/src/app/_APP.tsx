"use client";
import { UserProvider } from '@/hooks/UserContext';
import { ConfigProvider } from 'antd';
import React from 'react'

export function _APP({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <ConfigProvider>
                {children}
            </ConfigProvider>
        </UserProvider>
    )
}
