"use client";
import { GetPerusahaan } from '@/api';
import { PAGE } from '@/consts';
import { useUserContext } from '@/hooks/UserContext';
import React, { useEffect } from 'react'
import styles from "./dashboard.module.sass"
import { PageHeader } from "@/components/global"

const page = PAGE.DASHBOARD.TITLE;

export default function Dashboard() {
    const { setPage, setPerusahaan, perusahaan } = useUserContext()

    const handleGetPerusahaan = async () => {
        const response = await GetPerusahaan()
        setPerusahaan(response)
    }

    console.log('page', page)

    useEffect(() => {
        setPage(page);

        if (!perusahaan) {
            handleGetPerusahaan()
        }
    }, [perusahaan]);

    return (
        <div className={styles.dashboard}>
            <PageHeader page={"Dashboard"} />

        </div>
    )
}
