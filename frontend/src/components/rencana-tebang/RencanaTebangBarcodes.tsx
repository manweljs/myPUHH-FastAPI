"use client";
import React, { useEffect, useState } from 'react'
import { SpreadSheets } from '@/components/global'
import { GetBarcodeRencanaTebang, SaveBarcodeRencanaTebang } from '@/api';
import { LHCBarcodeType, RencanaTebangType } from '@/types';
import { message, Modal, Space, Spin } from 'antd';
import { ColumnModel } from '@syncfusion/ej2-react-spreadsheet';
import s from "./rencana-tebang.module.sass"
import { LoadingModal } from '../global';

const initialData: object = {
    id: "",
    barcode: ""
}

export function RencanaTebangBarcodes(props: {
    rencanaTebang?: RencanaTebangType
}) {
    const { rencanaTebang } = props
    const [data, setData] = useState<object[]>([])
    const [loading, setLoading] = useState(false)

    const handleGetBarcodes = async () => {
        if (!rencanaTebang) return
        const response = await GetBarcodeRencanaTebang(rencanaTebang.id)
        console.log(response)
        if (response.length === 0) {
            setData([initialData])
            return
        }
        const data = response.map((item: LHCBarcodeType, index: number) => {
            return {
                id: item.id,
                barcode: item.barcode,
            }
        })
        setData(data)
    }

    useEffect(() => {
        handleGetBarcodes()
    }, []);

    const columns: ColumnModel[] = [
        { width: 60, index: 0, isLocked: true, },
        { width: 220, index: 1, },
    ];

    const handleSaveAsJson = async (data: any) => {
        if (!rencanaTebang) return
        const finalData = {
            barcodes: data.data[0].rows.map((item: { barcode: string, id: string }) => {
                return {
                    id: item.id || null,
                    barcode: item.barcode
                }
            })
        }

        // console.log('final data untuk database --->', finalData)
        setLoading(true)
        const response = await SaveBarcodeRencanaTebang(rencanaTebang.id, finalData)
        // console.log('response', response)
        if (response.success) {
            message.success('Data berhasil disimpan')
            handleGetBarcodes()
        } else {
            message.error(response.errors.map((item: any) => item.message).join(', '))

        }
        setLoading(false)
    }

    return (
        <div className={s.lhc_barcodes}>
            <LoadingModal open={loading} />
            <SpreadSheets
                data={data}
                colCount={3}
                columns={columns}
                onSaveAsJson={handleSaveAsJson}
                className={s.spreadsheet_container}
            />
        </div>
    )
}
