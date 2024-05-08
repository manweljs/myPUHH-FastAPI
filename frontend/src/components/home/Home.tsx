"use client";
import { GetPerusahaan } from '@/api';
import { PAGE } from '@/consts';
import { useUserContext } from '@/hooks/UserContext';
import React, { useEffect } from 'react'

const page = PAGE.HOME.TITLE;
document.title = page;

export default function Home() {
    const { setPage, setPerusahaan, perusahaan } = useUserContext()

    const handleGetPerusahaan = async () => {
        console.log('masuk sini', perusahaan)
        const response = await GetPerusahaan()
        console.log(response)
        console.log('masuk sudah get perusahaan', perusahaan)

        setPerusahaan(response.data)
    }


    useEffect(() => {
        setPage(page);

        if (!perusahaan) {
            handleGetPerusahaan()
        }
    }, [perusahaan]);

    return (
        <div className="home">
        </div>
    )
}
