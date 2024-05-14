"use client";
import React, { useEffect, useState } from 'react'
import { SpreadSheets } from '@/components/global/SpreadSheets'
import s from "./lhc.module.sass"
import { PageHeader } from '../global';
import { GetAllBarcode, GetBarcodesByLHC, SaveLHCBarcode } from '@/api';
import { LHCBarcodeType } from '@/types';
import { Button, Modal, Space, Spin, Table } from 'antd';
import { ColumnModel } from '@syncfusion/ej2-react-spreadsheet';

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
            barcodes: data[0].rows
        }

        console.log('final data untuk database --->', finalData)
        setLoading(true)
        const response = await SaveLHCBarcode(id, finalData)
        console.log('response', response)
        setLoading(false)
    }

    return (
        <div className={s.lhc_barcodes}>
            {loading &&
                <Modal open footer={null}>
                    <Space>
                        <Spin />
                        <div>Loading...</div>
                    </Space>

                </Modal>
            }
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
