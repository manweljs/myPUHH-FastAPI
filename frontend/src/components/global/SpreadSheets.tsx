import React, { useEffect, useRef, useState } from 'react'
import { SheetsDirective, SheetDirective, RangesDirective, RangeDirective, SpreadsheetComponent, BeforeSaveEventArgs, ColumnsDirective, ColumnDirective, Inject, Filter, ColumnModel } from '@syncfusion/ej2-react-spreadsheet';
import s from "./global.module.sass"
import { Button } from 'antd';

interface Props {
    data?: object[]
    colCount?: number
    columns?: ColumnModel[]
    onSaveAsJson?: (data: any) => void
    className?: string
}

const defaultData: object[] = [
    { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, ShipCity: 'Reims' },
    { OrderID: 10249, CustomerID: 'TOMSP', EmployeeID: 6, ShipCity: 'Münster' },
    { OrderID: 10250, CustomerID: 'HANAR', EmployeeID: 4, ShipCity: 'Lyon' }
];

export function SpreadSheets(props: Props) {
    const { data, colCount, columns, onSaveAsJson, className = "" } = props
    const beforeOpen = (): void => { };

    const spreadsheetRef = useRef<SpreadsheetComponent>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [loading, setLoading] = useState(false);

    const beforeSave = async (args: BeforeSaveEventArgs) => {
        if (!spreadsheetRef.current) return;
        // Mencegah Spreadsheet menyimpan file secara default

        // console.log('first', spreadsheetRef.current)
        console.log('args', args)
    };

    const handleChange = (e: any) => {
        console.log('e', e)
    }

    const handleSaveAsJson = async () => {
        setLoading(true);
        try {
            if (spreadsheetRef.current) {
                const jsonData = await spreadsheetRef.current.saveAsJson() as any;
                const finalData = await handleExtractData(jsonData.jsonObject.Workbook);
                console.log('final Data --> ', finalData)
                onSaveAsJson && onSaveAsJson(finalData.data);
            }

        } catch (error) {
            console.error('Error while saving as JSON:', error);
        }
        setLoading(false);
    };


    useEffect(() => {
        // Fungsi untuk menerapkan filter dan autofit
        const applyFilterAndAutofit = async () => {
            const condition = { field: 'A', operator: 'contains', value: '' };
            spreadsheetRef.current?.applyFilter([condition], 'A1:C1');
            // spreadsheetRef.current?.autoFit('A:C');
        };

        if (data && spreadsheetRef.current && !isInitialized) {
            const sheet = spreadsheetRef.current.getActiveSheet();
            const cellValue = sheet?.rows?.[1]?.cells?.[0]?.value ?? '';
            if (cellValue !== '') {
                applyFilterAndAutofit();
                setIsInitialized(true);
            }
        }
    }, [data, spreadsheetRef.current, isInitialized]);

    const scrollSettings = {

    };


    return (
        <div className={className}>
            <Button
                onClick={handleSaveAsJson}
                className={s.save_button}
                type='primary'
                loading={loading}
            >Save to Database</Button>

            <SpreadsheetComponent
                onChange={handleChange}
                ref={spreadsheetRef}
                className={s.spreadsheet}
                allowOpen={true}
                beforeOpen={beforeOpen}
                openUrl='https://services.syncfusion.com/react/production/api/spreadsheet/open'
                allowSave={true}
                saveUrl='https://services.syncfusion.com/react/production/api/spreadsheet/save'
                beforeSave={beforeSave}
                scrollSettings={scrollSettings}

            >

                <SheetsDirective  >
                    <SheetDirective frozenRows={1} colCount={colCount} columns={columns}  >
                        <RangesDirective >
                            <RangeDirective dataSource={data || defaultData} ></RangeDirective>
                        </RangesDirective>

                    </SheetDirective>
                </SheetsDirective>
                <Inject services={[Filter]} />
            </SpreadsheetComponent>
        </div>
    )
}
const handleExtractData = async (workbookJson: any) => {
    console.log('workbookJson', workbookJson);

    const formattedData = {
        data: workbookJson.sheets.map((sheet: any) => {
            // Ambil baris pertama sebagai nama kolom
            const columnNamesRow = sheet.rows[0];
            if (!columnNamesRow || !columnNamesRow.cells) {
                throw new Error("Baris pertama tidak valid atau tidak memiliki cells");
            }

            const columnNames = columnNamesRow.cells.map((cell: any) => cell?.value || "");

            // Mengumpulkan data untuk setiap baris, dimulai dari baris kedua
            const rowsData = sheet.rows.slice(1) // mulai dari baris kedua
                .map((row: any) => {
                    if (!row?.cells) {
                        return null; // Kembalikan null jika tidak ada cells
                    }

                    const rowData: any = {};
                    row.cells.forEach((cell: any, index: number) => {
                        const columnName = columnNames[index] || `column_${index + 1}`;
                        rowData[columnName] = cell?.value || "";
                    });

                    // Periksa apakah semua cell dalam baris kosong
                    const allCellsEmpty = Object.values(rowData).every(value => value === "");
                    return allCellsEmpty ? null : rowData;
                })
                .filter((row: any) => row !== null); // Filter baris yang bukan null

            return {
                name: sheet.name,
                rows: rowsData
            };
        })
    };

    console.log("Formatted Data Ready to Send:", formattedData);
    return formattedData; // Data siap dikirim atau digunakan lebih lanjut
};
