"use client";
import React, { useEffect, useState } from 'react'
import { SpreadSheets } from '@/components/global'
import { GetBarcodesByLHC, SaveLHCBarcode } from '@/api';
import { LHCBarcodeType } from '@/types';
import { message, Modal, Space, Spin } from 'antd';
import { ColumnModel } from '@syncfusion/ej2-react-spreadsheet';
import s from "./lhc.module.sass"
import { LoadingModal } from '../global';

const initialData: object = {
    id: "",
    barcode: ""
}

export function LHCDetailBarcodes(props: { id: string }) {
    const { id } = props
    const [data, setData] = useState<object[]>([])
    const [loading, setLoading] = useState(false)

    const handleGetBarcodes = async () => {
        const response = await GetBarcodesByLHC(id)
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
        const finalData = {
            lhc_id: id,
            barcodes: data.data[0].rows.map((item: { barcode: string, id: string }) => {
                return {
                    id: item.id || null,
                    barcode: item.barcode
                }
            })
        }

        // console.log('final data untuk database --->', finalData)
        setLoading(true)
        const response = await SaveLHCBarcode(id, finalData)
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
