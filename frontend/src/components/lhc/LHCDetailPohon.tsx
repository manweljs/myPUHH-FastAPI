"use client"
import React, { useEffect, useState } from "react";
import { GetAllPohonByLHC, GetLHC, GetPresignedUrl, SaveLHCPohon } from "@/api";
import s from "./lhc.module.sass";
import { DraftSpreadsheetType, LHCPohonInType, LHCType, PohonInType } from "@/types";
import { LoadingModal, SpreadSheets } from "../global";
import { SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";
import { sanitizeFilename } from "@/functions";
import { GetDraftSpreadsheets, SaveDraftSpreadsheet } from "@/api/SpreadsheetAPI";
import { message } from "antd";

const FAKTOR_BENTUK = 0.6;
const initialData: PohonInType = {
    id: null,
    nomor: 1,
    petak: "",
    jalur: "",
    arah_jalur: "",
    panjang_jalur: 0,
    jenis: "",
    diameter: 0,
    tinggi: 0,
    volume: 0,
    sortimen: "",
    koordinat_x: "",
    koordinat_y: "",
    barcode: null,
}

export default function LHCDetailPohon(props: {
    id: string
}) {
    const { id } = props;
    const [lhc, setLHC] = useState<LHCType | null>(null);
    const [listPohon, setListPohon] = useState<PohonInType[]>([]);
    const [loading, setLoading] = useState(true);
    const [draftWorkbooks, setDraftWorkbooks] = useState<DraftSpreadsheetType[]>([]);

    const handleGetAllPohon = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await GetAllPohonByLHC(id);
            console.log(response);
            if (response.length > 0) {
                setListPohon(response);
            } else {
                setListPohon([initialData]);
            }

        } catch (error) {
            console.log('error', error)
        }
        setLoading(false);
    };

    const handleGetLHC = async () => {
        if (!id) return;
        const response = await GetLHC(id);
        console.log(response);
        setLHC(response);
    };

    const handleGetDraftWorkbooks = async () => {
        if (!lhc) return;
        const response = await GetDraftSpreadsheets('lhc', lhc.id)
        console.log('response all workbooks draft', response)
        setDraftWorkbooks(response);
    }

    console.log('draftWorkbooks', draftWorkbooks)

    useEffect(() => {
        handleGetLHC();
        handleGetAllPohon();
    }, []);

    useEffect(() => {
        if (lhc) {
            handleGetDraftWorkbooks();
        }
    }, [lhc]);

    const onCellChanges = async (ref: SpreadsheetComponent | null, args: any) => {
        if (!ref || !args) return;
        // console.log('args --> ', args);

        const address = args.address;
        // console.log('address: ', address);

        const match = address.match(/([A-Z]+)(\d+)/);
        if (match) {
            const colLetter = match[1];
            const rowIndex = parseInt(match[2]) - 1;
            const colIndex = colLetter.charCodeAt(0) - 65;

            // console.log('rowIndex: ', rowIndex, 'colIndex: ', colIndex);

            if (colIndex === 8 || colIndex === 9) { // 8 untuk tinggi, 9 untuk diameter
                const diameterCellAddress = `H${rowIndex + 1}`; // H adalah kolom untuk diameter
                const tinggiCellAddress = `I${rowIndex + 1}`; // I adalah kolom untuk tinggi
                const volumeCellAddress = `J${rowIndex + 1}`; // J adalah kolom untuk volume
                const sortimenCellAddress = `K${rowIndex + 1}`; // K adalah kolom untuk sortimen
                const formula = `=ROUND((0.7854*${FAKTOR_BENTUK})*${diameterCellAddress}^2*${tinggiCellAddress}/10000,2)`; // Formula perhitungan volume
                //IF(H2<30,"KBK",IF(H2<50,"KBS","KB"))
                const formulaSortimen = `=IF(${diameterCellAddress}<30,"KBK",IF(${diameterCellAddress}<50,"KBS","KB"))`
                ref.updateCell({ formula: formula }, volumeCellAddress); // Update volume dengan formula
                ref.updateCell({ formula: formulaSortimen }, sortimenCellAddress); // Update sortimen dengan formula
                ref.updateCell({ format: '0.00' }, volumeCellAddress); // Format volume menjadi 2 desimal
            }
        }

    }

    const isValidBarcodeOrNone = (barcode: string) => {
        if (!barcode) return null;
        if (barcode.trim().length === 27) {
            return barcode;
        } else {
            return null;
        }
    }

    const handleSaveToDatabase = async (data: any) => {
        // clean up sebelum dikirim ke database
        setLoading(true);
        try {
            console.log('data to clean', data)

            const cleanedData: LHCPohonInType = data[0].rows.map((row: any) => {
                // Buat objek baru tanpa properti id jika id kosong atau null
                const cleanedRow: any = {
                    ...row,
                    volume: parseFloat(row.volume),
                    diameter: parseInt(row.diameter),
                    tinggi: parseInt(row.tinggi),
                    barcode: isValidBarcodeOrNone(row.barcode),
                };

                // Hanya tambahkan properti id jika tidak kosong atau null
                if (row.id) {
                    cleanedRow.id = row.id;
                } else {
                    delete cleanedRow.id;
                }

                return cleanedRow;
            });

            // mengirim data ke server 
            try {
                const response = await SaveLHCPohon(id, cleanedData)
                console.log('response', response)

            } catch (error) {
                console.log('error', error)
            }
        } catch (error) {

            console.log('error', error)
            message.error((error as any).toString())
        }
        setLoading(false);
    }

    const handleSaveAsDraft = async (data: any, draft?: DraftSpreadsheetType | null, isNewVersion: boolean = false) => {
        if (!lhc) return;
        setLoading(true);
        console.log('data to save as draft', data.jsonObject);
        let version = 1;
        try {
            if (isNewVersion) {
                version = draftWorkbooks.length + 1;
            } else if (draft && draft.version) {
                version = draft.version;
            }

            const workbook = JSON.stringify(data.jsonObject)
            const sanitizedNomor = sanitizeFilename(lhc?.nomor);
            const filename = `spreadsheets/draft-${sanitizedNomor}.json`;
            const { presigned } = await GetPresignedUrl(filename, 'application/json');

            if (presigned) {
                console.log('presigned--->', presigned)
                const response = await fetch(presigned, {
                    method: 'PUT',
                    body: workbook,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('response', response);
                if (response.ok) {
                    //save draft object to database
                    const draftData: DraftSpreadsheetType = {
                        id: isNewVersion ? null : draft ? draft.id : null,
                        object: 'lhc',
                        object_id: lhc.id,
                        title: `draft-${sanitizedNomor}-v${version}`,
                        file_url: presigned.split('?')[0],
                        version: version
                    }

                    const response = await SaveDraftSpreadsheet(draftData);
                    console.log('response save draft', response);
                    if (response.id) {
                        handleGetDraftWorkbooks();
                    }

                }
            }

            if (isNewVersion) {
                handleGetDraftWorkbooks()
            }
        } catch (error) {
            console.log('error', error)
        }

        setLoading(false);

    };

    return (
        <div className={s.lhc_pohons}>
            <LoadingModal open={loading} />
            <SpreadSheets

                data={listPohon}
                className={s.spreadsheet_container}
                onCellChanges={onCellChanges}
                onSaveAsJson={handleSaveToDatabase}
                onSaveAsDraft={handleSaveAsDraft}
                drafts={draftWorkbooks}
            />
        </div>
    );
}



