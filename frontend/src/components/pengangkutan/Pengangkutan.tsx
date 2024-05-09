"use client";
import React, { useEffect } from 'react'
import { PageHeader } from '@/components/global'
import { useUserContext } from '@/hooks/UserContext'
import { PAGE } from '@/consts';
import styles from "./pengangkutan.module.sass"

const page = PAGE.PENGANGKUTAN.TITLE;

export function Pengangkutan() {
    const { setPage } = useUserContext()

    useEffect(() => {
        setPage(page);
    }, []);

    return (
        <div className={styles.pengangkutan}>
            <PageHeader page={page} />
        </div>
    )
}
