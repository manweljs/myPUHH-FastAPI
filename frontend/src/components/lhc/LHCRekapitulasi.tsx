import { GetRekapitulasiLHC } from '@/api'
import React, { useEffect, useRef, useState } from 'react'
import s from "./lhc.module.sass"
import { IDataOptions, IDataSet, PivotViewComponent } from '@syncfusion/ej2-react-pivotview';
import { GridSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/gridsettings';

// const defaultValue = [
//     { 'Sold': 31, 'Amount': 52824, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q1' },
//     { 'Sold': 51, 'Amount': 86904, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q2' },
//     { 'Sold': 90, 'Amount': 153360, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q3' },
//     { 'Sold': 25, 'Amount': 42600, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q4' },
//     { 'Sold': 27, 'Amount': 46008, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2016', 'Quarter': 'Q1' }
// ];

export default function LHCRekapitulasi(props: {
    lhc_id: string
}) {

    const pivotRef = useRef<PivotViewComponent>(null);
    const { lhc_id } = props
    const [rekapitulasi, setRekapitulasi] = useState<IDataSet[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [pivotHeight, setPivotHeight] = useState<number>(600)

    const handleGetRekapitulasi = async () => {
        setLoading(true)
        try {
            const response = await GetRekapitulasiLHC(lhc_id)
            console.log('response', response)
            const data = response.data.map((item: any) => {
                return {
                    KelasDiameter: item.kelas_diameter__nama,
                    Count: item.jumlah_pohon,
                    Volume: item.total_volume,
                    Jenis: item.jenis__nama,
                    Status: item.status_pohon__nama
                }
            })
            setRekapitulasi(data)
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        handleGetRekapitulasi()
    }, []);

    useEffect(() => {
        // menghitung tinggi screen kurang 100px
        const height = window.innerHeight - 120
        setPivotHeight(height)
    }, []);


    console.log('rekapitulasi', rekapitulasi)

    const dataSourceSettings = {
        expandAll: false,
        formatSettings: [{ name: 'Volume', format: 'N2' }],
        rows: [
            { name: 'Status' },
            { name: 'Jenis' }
        ],
        columns: [
            { name: 'KelasDiameter', caption: 'Kelas Diameter' }
        ],
        values: [
            { name: 'Count', caption: 'n' },
            { name: 'Volume', caption: 'v' }
        ],
        filters: []
    }
    useEffect(() => {
        setTimeout(() => {
            if (pivotRef.current && window) {
                pivotRef.current.dataSourceSettings = {
                    dataSource: rekapitulasi,

                }
            }
        }, 0);
    }, [rekapitulasi, pivotRef.current]);

    // const dataSourceSettings = {
    //     columns: [{ name: 'Year', caption: 'Production Year' }, { name: 'Quarter' }],
    //     expandAll: false,
    //     filters: [],
    //     formatSettings: [{ name: 'Amount', format: 'C0' }],
    //     rows: [{ name: 'Country' }, { name: 'Products' }],
    //     values: [{ name: 'Sold', caption: 'Units Sold' }, { name: 'Amount', caption: 'Sold Amount' }]
    // };

    const gridSettings: GridSettings = {
        columnWidth: 60
    } as GridSettings;

    return (
        <div className={s.rekapitulasi_lhc_container}>
            <h3>Rekapitulasi 0</h3>
            <PivotViewComponent
                spinnerTemplate={" "}
                ref={pivotRef}
                id='PivotView'
                height={pivotHeight}
                dataSourceSettings={dataSourceSettings}
                gridSettings={gridSettings}
            ></PivotViewComponent>
        </div>
    )
}

