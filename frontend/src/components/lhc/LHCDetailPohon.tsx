"use client"
import React, { useEffect, useState } from "react";
import { GetAllPohonByLHC, GetLHC, GetPresignedUrl } from "@/api";
import s from "./lhc.module.sass";
import { DraftSpreadsheetType, LHCType, PohonInType } from "@/types";
import { LoadingModal, SpreadSheets } from "../global";
import { SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";
import { sanitizeFilename } from "@/functions";

const FAKTOR_BENTUK = 0.6;
const initialData: PohonInType = {
    id: null,
    nomor: 1,
    barcode: "",
    petak: "",
    jalur: "",
    arah_jalur: "",
    panjang_jalur: 0,
    jenis: "",
    tinggi: 0,
    diameter: 0,
    volume: 0,
    sortimen: "",
    koordinat_x: "",
    koordinat_y: "",
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

    useEffect(() => {
        handleGetLHC();
        handleGetAllPohon();
    }, []);

    const onCellChanges = async (ref: SpreadsheetComponent | null, args: any) => {
        if (!ref || !args) return;
        console.log('args --> ', args);

        const address = args.address;
        console.log('address: ', address);

        const match = address.match(/([A-Z]+)(\d+)/);
        if (match) {
            const colLetter = match[1];
            const rowIndex = parseInt(match[2]) - 1;
            const colIndex = colLetter.charCodeAt(0) - 65;

            console.log('rowIndex: ', rowIndex, 'colIndex: ', colIndex);

            if (colIndex === 8 || colIndex === 9) { // 8 untuk tinggi, 9 untuk diameter
                const volumeCellAddress = `K${rowIndex + 1}`; // K adalah kolom untuk volume
                const tinggiCellAddress = `I${rowIndex + 1}`; // I adalah kolom untuk tinggi
                const diameterCellAddress = `J${rowIndex + 1}`; // J adalah kolom untuk diameter
                const formula = `=ROUND((0.7854*${FAKTOR_BENTUK})*${diameterCellAddress}^2*${tinggiCellAddress}/10000,2)`; // Formula perhitungan volume
                ref.updateCell({ formula: formula }, volumeCellAddress); // Update volume dengan formula
                ref.updateCell({ format: '0.00' }, volumeCellAddress); // Format volume menjadi 2 desimal
            }
        }

    }

    const handleSaveToDatabase = async (data: any) => {
        console.log('data to save', data)

    }

    const handleSaveAsDraft = async (data: any) => {
        if (!lhc) return;
        console.log('data to save as draft', data.jsonObject);
        const workbook = data.jsonObject;
        const sanitizedNomor = sanitizeFilename(lhc?.nomor);
        const filename = `spreadsheets/draft-${sanitizedNomor}.json`;
        const { presigned } = await GetPresignedUrl(filename, 'application/json');
        const response = await fetch(presigned, {
            method: 'PUT',
            body: workbook,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('response', response);
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


