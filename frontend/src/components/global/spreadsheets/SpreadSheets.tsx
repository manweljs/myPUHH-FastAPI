"use client";
import React, { useEffect, useRef, useState } from 'react'
import { SheetsDirective, SheetDirective, RangesDirective, RangeDirective, SpreadsheetComponent, BeforeSaveEventArgs, ColumnDirective, Inject, Filter, ColumnModel, BeforeOpenEventArgs } from '@syncfusion/ej2-react-spreadsheet';
import s from "../global.module.sass"
import { Button, Select, Space } from 'antd';
import FIcon from '../FIcon';
import { DraftSpreadsheetType } from '@/types';
import { customizeRibbon, setDefaultFormats, setDefaultFormulas } from './CustomConfig';
import { OpenExcelFile, SaveAsExcel, SaveAsJson } from './CustomFunctions';

interface Props {
    data?: object[]
    colCount?: number
    columns?: ColumnModel[]
    onSaveAsJson?: (data: any) => void
    className?: string
    onCellChanges?: (ref: SpreadsheetComponent | null, args: any) => void
    onSaveAsDraft?: (data: any, draft?: DraftSpreadsheetType | null, isNewVersion?: boolean) => void
    drafts?: DraftSpreadsheetType[]
    defaultFormulas?: any[]
    defaultFormats?: any[]
}

const defaultData: object[] = [
    { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, ShipCity: 'Reims' },
    { OrderID: 10249, CustomerID: 'TOMSP', EmployeeID: 6, ShipCity: 'Münster' },
    { OrderID: 10250, CustomerID: 'HANAR', EmployeeID: 4, ShipCity: 'Lyon' }
];

export function SpreadSheets(props: Props) {
    const {
        data,
        colCount,
        columns,
        onSaveAsJson,
        className = "",
        onCellChanges,
        onSaveAsDraft,
        drafts,
        defaultFormulas,
        defaultFormats,
    } = props
    const [spreadsheet, setSpreadsheet] = useState<SpreadsheetComponent | null>(null);
    const spreadsheetRef = useRef<SpreadsheetComponent | null>(null);
    const [sheetData, setSheetData] = useState<object[]>([]);

    useEffect(() => {
        if (spreadsheetRef.current) {
            setSpreadsheet(spreadsheetRef.current);
        }
        if (data) {
            setSheetData(data)
        }
    }, [spreadsheetRef.current, data]);


    const beforeOpen = (args: BeforeOpenEventArgs) => {
        console.log('args', args);

        // Batalkan operasi pembukaan default
        args.cancel = true;

        // Proses file yang dipilih
        if (args.file) {
            return OpenExcelFile(setSheetData, args.file as File);
        }
    };



    const [isInitialized, setIsInitialized] = useState(false);
    const [draftWorkbooks, setDraftWorkbooks] = useState<DraftSpreadsheetType[]>([]);
    const [selectedDraft, setSelectedDraft] = useState<DraftSpreadsheetType | null>(null);
    const [loading, setLoading] = useState(false);
    const isRibbonInitialized = useRef(false);


    const initialize = () => {
        if (!spreadsheet || isRibbonInitialized.current) return;
        console.log('init ribbon',)
        customizeRibbon(spreadsheet);
        setDefaultFormulas(spreadsheet, defaultFormulas || []);
        setDefaultFormats(spreadsheet, defaultFormats || []);
        isRibbonInitialized.current = true; // Set ini menjadi true setelah inisialisasi
    }

    useEffect(() => {
        if (spreadsheet && !isRibbonInitialized.current) {
            initialize();
        }
    }, [spreadsheet, isRibbonInitialized.current]);


    useEffect(() => {
        setDraftWorkbooks(drafts || [])
    }, [drafts])

    const beforeSave = async (args: BeforeSaveEventArgs) => {
        if (!spreadsheet) return;
        console.log('args', args)
        args.cancel = true;

        //@ts-ignore
        if (args.saveType === 'Json' && onSaveAsJson) {
            console.log("Processing save as JSON...");
            return SaveAsJson(spreadsheet, args, onSaveAsJson);
        }
        if (args.saveType === 'Xlsx') {
            console.log("Processing save as Excel...");
            return SaveAsExcel(spreadsheet, args);
        }
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
        if (!spreadsheet) return;
        console.log('masuk sini',)
        setLoading(true);
        // @ts-ignore
        spreadsheet.save({ saveType: 'Json' });
        setLoading(false);

    };

    const handleSaveAsDraft = async (newDraft: boolean = false) => {
        setLoading(true);
        try {
            if (spreadsheet) {
                const jsonData = await spreadsheet.saveAsJson() as any;
                console.log('jsonData', jsonData.jsonObject)
                onSaveAsDraft && onSaveAsDraft(jsonData, selectedDraft, newDraft);
            }

        } catch (error) {
            console.error('Error while saving as JSON:', error);
        }
        setLoading(false);
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
                            onClick={() => handleSaveAsDraft()}
                            loading={loading}
                            icon={<FIcon name='fi-rr-display-arrow-down' size={14} />}
                            type='primary'
                            title='Save and overwrite current draft'
                        >
                            Save Draft
                        </Button>
                    </Space.Compact>
                }

                {onSaveAsDraft &&
                    <Button
                        onClick={() => handleSaveAsDraft(true)}
                        loading={loading}
                        icon={<FIcon name='fi-rr-disk' size={14} />}
                        title='Save as new draft version'
                    >
                        Save New Draft
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
                ref={spreadsheetRef}
                openUrl='https://services.syncfusion.com/react/production/api/spreadsheet/open'
                saveUrl='https://services.syncfusion.com/react/production/api/spreadsheet/save'
                className={s.spreadsheet}
                allowOpen={true}
                beforeOpen={beforeOpen}
                allowSave={true}
                beforeSave={beforeSave}
                scrollSettings={scrollSettings}
                cellSave={handleCellChanges}

            >

                <SheetsDirective  >
                    <SheetDirective frozenRows={1} colCount={colCount} columns={columns}  >
                        <RangesDirective >
                            <RangeDirective dataSource={sheetData || defaultData} ></RangeDirective>
                        </RangesDirective>

                    </SheetDirective>
                </SheetsDirective>
                <Inject services={[Filter]} />
            </SpreadsheetComponent>
        </div>
    )
}

