import React, { useRef } from 'react'
import { SheetsDirective, SheetDirective, RangesDirective, RangeDirective, SpreadsheetComponent, BeforeSaveEventArgs } from '@syncfusion/ej2-react-spreadsheet';
import styles from "./global.module.sass"
import * as XLSX from 'xlsx';

interface Props {
    data?: object[]
}

const defaultData: object[] = [
    { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, ShipCity: 'Reims' },
    { OrderID: 10249, CustomerID: 'TOMSP', EmployeeID: 6, ShipCity: 'Münster' },
    { OrderID: 10250, CustomerID: 'HANAR', EmployeeID: 4, ShipCity: 'Lyon' }
];

export function SpreadSheets(props: Props) {
    const { data } = props
    const beforeOpen = (): void => { };

    const spreadsheetRef = useRef<any>(null);

    const beforeSave = async (args: BeforeSaveEventArgs) => {
        if (!spreadsheetRef.current) return;
        // Mencegah Spreadsheet menyimpan file secara default

        console.log('first', spreadsheetRef.current)

        if (spreadsheetRef.current) {
            const jsonData = await spreadsheetRef.current.saveAsJson();
            console.log(jsonData);

            // Kirim jsonData ke server atau simpan sesuai kebutuhan
            // fetch(...) atau operasi lainnya
        }
        args.cancel = true;
    };

    return (
        <SpreadsheetComponent
            ref={spreadsheetRef}
            className={styles.spreadsheet}
            allowOpen={true}
            beforeOpen={beforeOpen}
            openUrl='https://services.syncfusion.com/react/production/api/spreadsheet/open'
            allowSave={true}
            saveUrl='https://services.syncfusion.com/react/production/api/spreadsheet/save'
            beforeSave={beforeSave}

        >
            <SheetsDirective>
                <SheetDirective>
                    <RangesDirective>
                        <RangeDirective dataSource={data || defaultData}></RangeDirective>
                    </RangesDirective>
                </SheetDirective>
            </SheetsDirective>
        </SpreadsheetComponent>
    )
}
