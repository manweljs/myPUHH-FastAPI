"use client";
import React, { useEffect, useState } from 'react'
import { SpreadSheets } from '@/components/global/SpreadSheets'
import { GetBarcodesByLHC, SaveLHCBarcode } from '@/api';
import { LHCBarcodeType } from '@/types';
import { message, Modal, Space, Spin } from 'antd';
import { ColumnModel } from '@syncfusion/ej2-react-spreadsheet';
import s from "./lhc.module.sass"
import { LoadingModal } from '../global';

const initialData: object = {
    no: "",
    id: "",
    barcode: ""
}

export function LHCDetailBarcodes(props: { id: string }) {
    const { id } = props
    const [data, setData] = useState<object[]>([initialData])
    const [loading, setLoading] = useState(false)
    const handleGetBarcodes = async () => {
        const response = await GetBarcodesByLHC(id)
        console.log(response)
        const data = response.map((item: LHCBarcodeType, index: number) => {
            return {
                no: index + 1,
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
        { width: 100, index: 1, isLocked: true, },
        { width: 220, index: 2, },
    ];

    const handleSaveAsJson = async (data: any) => {
        const finalData = {
            lhc_id: id,
            barcodes: data[0].rows.map((item: { barcode: string, id: string }) => {
                return {
                    id: item.id || null,
                    barcode: item.barcode
                }
            })
        }

        console.log('final data untuk database --->', finalData)
        setLoading(true)
        const response = await SaveLHCBarcode(id, finalData)
        console.log('response', response)
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
