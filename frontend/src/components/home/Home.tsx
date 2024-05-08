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
        const response = await GetPerusahaan()
        setPerusahaan(response)
    }


    useEffect(() => {
        setPage(page);

        if (!perusahaan) {
            handleGetPerusahaan()
        }
    }, [perusahaan]);



    return (
        <div className="home">
            <h1>myPUHH</h1>
            {perusahaan &&
                <div>
                    <h2>{perusahaan.nama}</h2>
                </div>
            }
        </div>
    )
}
