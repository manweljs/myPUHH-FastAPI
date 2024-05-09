"use client";
import React, { useEffect } from 'react'
import { PageHeader } from '@/components/global'
import { useUserContext } from '@/hooks/UserContext'
import { PAGE } from '@/consts'
import styles from "./stok.module.sass"

const page = PAGE.STOK.TITLE;

export default function Stok() {

    const { setPage } = useUserContext()


    useEffect(() => {
        setPage(page);
    }, []);

    return (
        <div className={styles.stok}>
            <div className={styles.main}>
                <PageHeader page={page} />
            </div>
        </div>
    )
}
