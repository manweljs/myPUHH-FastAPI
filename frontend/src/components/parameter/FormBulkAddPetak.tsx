"use client";
import { Modal } from 'antd';
import React, { useEffect } from 'react'
import { SpreadSheets } from '../global';
import { PetakInType, PetakType } from '@/types';
import { GetAllPetak } from '@/api';
import { SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet';

interface Props {
    data: PetakType[]
    close: () => void;
    reload: () => void;
    open?: boolean;

}

const defaultData = [{
    id: "",
    nama: "",
    blok: "",
    luas: 0,
}]

export default function FormBulkAddPetak(props: Props) {
    const { data, close, reload, open } = props
    const [isInitialized, setIsInitialized] = React.useState(false);
    const [sheetData, setSheetData] = React.useState<any[]>([]);
    const [spreadsheet, setSpreadsheet] = React.useState<SpreadsheetComponent | null>(null);

    useEffect(() => {
        if (data) {
            setSheetData(data)
        }
        setIsInitialized(true);
    }, [data]);

    console.log('spreadsheet dari param', spreadsheet)

    useEffect(() => {
        // Check if sheetData is present before setting the timeout
        if (sheetData) {
            // Set the timeout and save the timeout ID
            const timeoutId = setTimeout(() => {
                spreadsheet?.refresh();
            }, 10);

            // Clear the timeout when the component is unmounted or when sheetData changes
            return () => clearTimeout(timeoutId);
        }
    }, [sheetData]);


    return (
        < >
            {
                isInitialized &&
                <SpreadSheets
                    data={defaultData}
                    className='parameter-petak-spreadsheet'
                    setRef={setSpreadsheet}
                    close={close}

                />
            }
        </>
    )
}
