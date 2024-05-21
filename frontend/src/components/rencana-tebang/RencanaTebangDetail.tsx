"use client";
import React, { useEffect, useState } from 'react'
import s from "./rencana-tebang.module.sass"
import { SearchOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { Button, Popconfirm, Table, Tabs } from 'antd'
import ModalUploadBarcodeRencanaTebang from './ModalUploadBarcode'
import { GetRencanaTebang } from '@/api'
import { PageHeader } from '@/components/global'
import { RencanaTebangType } from '@/types'
import { RencanaTebangSummary } from './RencanaTebangSummary';
import { RencanaTebangBarcodes } from './RencanaTebangBarcodes';

interface Props {
    id: string
}
export default function RencanaTebangDetail(props: Props) {
    const { id } = props
    const [rencanaTebang, setRencanaTebang] = useState<RencanaTebangType | undefined>(undefined)
    const [DKB, setDKB] = useState([])
    const [loading, setLoading] = useState(true)

    const handleGetRencanaTebang = async () => {
        setLoading(true)
        const response = await GetRencanaTebang(id)
        setRencanaTebang(response)
        setLoading(false)
    }

    const obyek = rencanaTebang?.obyek === 0 ? "Petak / Blok" : "Trase Jalan"
    const pageTitle = loading ? "" : `Rencana Tebang - ${rencanaTebang?.nomor} (${obyek})`

    console.log('rencanaTebang', rencanaTebang)
    //items antd tabs 
    const items = [
        {
            key: "1",
            label: "Summary",
            children: <RencanaTebangSummary rencanaTebang={rencanaTebang} />
        },
        {
            key: "3",
            label: "Barcode",
            children: <RencanaTebangBarcodes rencanaTebang={rencanaTebang} />
        },
        {
            key: "2",
            label: "Pohon",
            children: <div>Detail</div>
        },
    ]

    useEffect(() => {
        handleGetRencanaTebang()
    }, [id]);

    return (
        <div className={s.rencana_tebang_detail}>
            <PageHeader back={"/rencana-tebang"} page={pageTitle} size={"small"} />
            <div className={s.main}>
                <Tabs
                    className={s.tabs}
                    tabPosition='left'
                    items={items}
                />
            </div>
        </div>
    )
}
