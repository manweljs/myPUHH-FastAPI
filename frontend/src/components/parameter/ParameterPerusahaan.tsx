import React, { useEffect, useState } from 'react'
import { GetPerusahaan } from '@/api'
import { PerusahaanType } from '@/types'
import { FormPerusahaan } from '../forms/FormPerusahaan'
import { LOGO_DEFAULT } from '@/consts'
import { Button } from 'antd'
import { useUserContext } from '@/hooks/UserContext'


const page = "Perusahaan"

export function ParameterPerusahaan() {

    const { perusahaan: initial } = useUserContext()
    const [perusahaan, setPerusahaan] = useState<PerusahaanType | null>(initial)
    const [displayForm, setDisplayForm] = useState(false)
    const [loading, setLoading] = useState(true)


    const handleClose = () => {
        setDisplayForm(false)
        handleGetPerusahaan()
    }

    const handleEdit = () => {
        setDisplayForm(true)
    }

    const handleGetPerusahaan = async () => {
        setLoading(false)
        const response = await GetPerusahaan()
        setPerusahaan(response)
        setLoading(false)
    }

    useEffect(() => {
        if (!perusahaan) {
            handleGetPerusahaan()
        }

    }, [perusahaan]);

    return (
        <div className={`setting-${page}`}>
            <div className="header mb-3">
                <h3>{page}</h3>
            </div>
            {
                !displayForm && perusahaan &&
                <div className="detail-perusahaan mb-6">
                    <div className="name-box">
                        <img src={perusahaan.logo || LOGO_DEFAULT} alt="" className="logo" />
                        <div className="group">
                            <h2>{perusahaan.nama}</h2>
                            <p>{perusahaan.alamat}
                                <span> {perusahaan.kabupaten?.nama} </span>
                                <span> {perusahaan.kabupaten?.propinsi}</span>

                            </p>
                            {perusahaan.telepon &&
                                <p> Telepon : {perusahaan.telepon}</p>
                            }

                        </div>

                    </div>
                </div>
            }

            {displayForm && perusahaan ?
                <FormPerusahaan perusahaan={perusahaan} reload={handleGetPerusahaan} close={handleClose} />
                :
                <Button
                    type='primary'
                    onClick={handleEdit}
                >Edit</Button>
            }
        </div>
    )
}








