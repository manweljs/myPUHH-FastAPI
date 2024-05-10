"use client";
import React, { useEffect, useState } from 'react'
import { SpreadSheets } from '@/components/global/SpreadSheets'
import styles from "./cruising.module.sass"
import { PageHeader } from '../global';
import { GetAllBarcode } from '@/api';
import { LHCBarcodeType } from '@/types';

export function LHCBarcodes() {

    const [data, setData] = useState<any[]>([])
    const handleGetBarcodes = async () => {
        const response = await GetAllBarcode()
        console.log(response)
        const data = response.map((item: LHCBarcodeType, index: number) => {
            return {
                no: index + 1,
                barcode: item.barcode,
                lhc_id: item.lhc_id,
            }
        })
        setData(data)
    }

    useEffect(() => {
        handleGetBarcodes()
    }, []);

    return (
        <div className={styles.lhc_barcodes}>
            <PageHeader page="LHC Barcodes" />
            <div className={styles.spreadsheet_container}>
                <SpreadSheets data={data} />
            </div>
        </div>
    )
}
