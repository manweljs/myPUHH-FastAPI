"use client";
import React, { useEffect } from 'react'
import { PageHeader } from '@/components/global'
import { useUserContext } from '@/hooks/UserContext'
import styles from "./laporan.module.sass"
import { PAGE } from '@/consts'

const page = PAGE.LAPORAN.TITLE;

export function Laporan() {
    const { setPage } = useUserContext()


    useEffect(() => {
        setPage(page);
    }, []);

    return (
        <div className={styles.laporan}>
            <PageHeader page={page} />
        </div>
    )
}
