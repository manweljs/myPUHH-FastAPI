"use client";
import React, { useEffect, useRef, useState } from 'react'
import { SheetsDirective, SheetDirective, RangesDirective, RangeDirective, SpreadsheetComponent, BeforeSaveEventArgs, ColumnDirective, Inject, Filter, ColumnModel } from '@syncfusion/ej2-react-spreadsheet';
import s from "../global.module.sass"
import { Button, Select, Space } from 'antd';
import FIcon from '../FIcon';
import { DraftSpreadsheetType } from '@/types';
import { customizeFormat, customizeRibbon } from './CustomConfig';
import SpreadsheetService from './SpreadsheetService';

interface Props {
    data?: object[]
    colCount?: number
    columns?: ColumnModel[]
    onSaveAsJson?: (data: any) => void
    className?: string
    onCellChanges?: (ref: SpreadsheetComponent | null, args: any) => void
    onSaveAsDraft?: (data: any, draft?: DraftSpreadsheetType | null) => void
    drafts?: DraftSpreadsheetType[]
}

const defaultData: object[] = [
    { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, ShipCity: 'Reims' },
    { OrderID: 10249, CustomerID: 'TOMSP', EmployeeID: 6, ShipCity: 'Münster' },
    { OrderID: 10250, CustomerID: 'HANAR', EmployeeID: 4, ShipCity: 'Lyon' }
];

export function SpreadSheets(props: Props) {
    const handleOnCreated = (instance: SpreadsheetComponent) => {
        spreadsheetService.spreadsheet = instance;
    };

    const spreadsheetService = SpreadsheetService.getInstance();
    const { spreadsheet } = spreadsheetService;

    const {
        data,
        colCount,
        columns,
        onSaveAsJson,
        className = "",
        onCellChanges,
        onSaveAsDraft,
        drafts,
    } = props
    const beforeOpen = (): void => { };

    const [isInitialized, setIsInitialized] = useState(false);
    const [draftWorkbooks, setDraftWorkbooks] = useState<DraftSpreadsheetType[]>([]);
    const [selectedDraft, setSelectedDraft] = useState<DraftSpreadsheetType | null>(null);
    const [loading, setLoading] = useState(false);
    const isRibbonInitialized = useRef(false);


    const initialize = () => {
        if (!spreadsheet || isRibbonInitialized.current) return;
        customizeRibbon();
        customizeFormat();
        isRibbonInitialized.current = true; // Set ini menjadi true setelah inisialisasi
    }

    useEffect(() => {
        if (spreadsheet && !isRibbonInitialized.current) {
            initialize();
        }
    }, []);


    useEffect(() => {
        setDraftWorkbooks(drafts || [])
    }, [drafts])

    const beforeSave = async (args: BeforeSaveEventArgs) => {
        if (spreadsheet) return;
        console.log('args', args)
    };




    useEffect(() => {
        // Fungsi untuk menerapkan filter dan autofit
        const applyFilterAndAutofit = async () => {
            if (!spreadsheet) return;
            const condition = { field: 'A', operator: 'contains', value: '' };
            spreadsheet.applyFilter([condition], 'A1:C1');
            // spreadsheetRef.current?.autoFit('A:C');
        };

        if (data && spreadsheet && !isInitialized) {
            const sheet = spreadsheet.getActiveSheet();
            const cellValue = sheet?.rows?.[1]?.cells?.[0]?.value ?? '';
            if (cellValue !== '') {
                applyFilterAndAutofit();
                setIsInitialized(true);
            }
        }

    }, [data, spreadsheet, isInitialized]);


    const scrollSettings = {};

    const loadDraftWorkbook = async (index: number) => {
        const draftSelected = draftWorkbooks[index];
        setSelectedDraft(draftSelected);
        const response = await fetch(draftSelected.file_url);
        console.log('response', response);
        if (response.ok) {
            try {
                const json = await response.json(); // Langsung mengambil dan parse JSON
                console.log('JSON object:', json); // Log objek JSON
                if (spreadsheet) {
                    console.log('draftWorkbook triggered', json);
                    spreadsheet.openFromJson({ file: json });
                }
            } catch (error) {
                console.error('Error parsing JSON:', error); // Handle kesalahan parsing
            }
        } else {
            console.error('Network response was not ok.');
        }
    }


    const handleSaveAsJson = async () => {
        setLoading(true);
        try {
            if (spreadsheet) {
                const jsonData = await spreadsheet.saveAsJson() as any;
                const finalData = await handleExtractData(jsonData.jsonObject.Workbook);
                console.log('final Data --> ', finalData)
                onSaveAsJson && onSaveAsJson(finalData.data);
            }

        } catch (error) {
            console.error('Error while saving as JSON:', error);
        }
        setLoading(false);
    };

    const handleSaveAsDraft = async () => {
        setLoading(true);
        try {
            if (spreadsheet) {
                const jsonData = await spreadsheet.saveAsJson() as any;
                console.log('jsonData', jsonData.jsonObject)
                onSaveAsDraft && onSaveAsDraft(jsonData, selectedDraft);
            }

        } catch (error) {
            console.error('Error while saving as JSON:', error);
        }
        setLoading(false);
    }

    const handleLoadDraft = async () => {

    }

    const handleCellChanges = (args: any) => {
        // console.log('args', args)

        onCellChanges && onCellChanges(spreadsheet, args);

    }



    return (
        <div className={className}>

            <div className={s.extra_button_spreadsheet}>
                {
                    draftWorkbooks && draftWorkbooks.length > 0 &&
                    <Space.Compact>
                        <Select
                            placeholder="Select Draft"
                            style={{ minWidth: 120 }}
                            onChange={loadDraftWorkbook}
                        >
                            {draftWorkbooks.map((draft, index) => (
                                <Select.Option key={index} >
                                    {draft.title}
                                </Select.Option>
                            ))}
                        </Select>
                        <Button
                            onClick={handleLoadDraft}
                            loading={loading}
                            icon={<FIcon name='fi-rr-display-arrow-down' size={14} />}
                            type='primary'
                        >
                            Load
                        </Button>
                    </Space.Compact>
                }

                {onSaveAsDraft &&
                    <Button
                        onClick={handleSaveAsDraft}
                        loading={loading}
                        icon={<FIcon name='fi-rr-disk' size={14} />}
                    >
                        Save Draft
                    </Button>
                }

                {onSaveAsJson &&
                    <Button
                        onClick={handleSaveAsJson}
                        type='primary'
                        loading={loading}
                        icon={<FIcon name='fi-rr-database' size={14} />}
                    >Save</Button>
                }
            </div>

            <SpreadsheetComponent
                ref={handleOnCreated}
                className={s.spreadsheet}
                allowOpen={true}
                beforeOpen={beforeOpen}
                openUrl='https://services.syncfusion.com/react/production/api/spreadsheet/open'
                allowSave={true}
                saveUrl='https://services.syncfusion.com/react/production/api/spreadsheet/save'
                beforeSave={beforeSave}
                scrollSettings={scrollSettings}
                cellSave={handleCellChanges}
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

