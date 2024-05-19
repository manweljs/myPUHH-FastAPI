"use client"
import React, { useEffect, useState } from "react";
import { GetAllJenis, GetAllPetak, GetAllPohonByLHC, GetAllSortimen, GetLHC, GetPresignedUrl, SaveLHCPohon } from "@/api";
import s from "./lhc.module.sass";
import { DraftSpreadsheetType, JenisPohonType, LHCPohonInType, LHCPohonSaveDatabaseType, LHCType, PetakType, PohonInType, PohonType, SortimenType } from "@/types";
import { LoadingModal, SpreadSheets } from "../global";
import { SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";
import { chunkArray, getJenisId, getKelasDiameterId, getPetakId, getSortimenId, getStatusPohonId, sanitizeFilename } from "@/functions";
import { GetDraftSpreadsheets, SaveDraftSpreadsheet } from "@/api/SpreadsheetAPI";
import { message } from "antd";

const BATCH_SIZE = 2000;
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
    kelas_diameter: "",
    koordinat_x: "",
    koordinat_y: "",
    status_pohon: null,
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
    const [listJenis, setListJenis] = useState<JenisPohonType[]>([]);
    const [listPetak, setListPetak] = useState<PetakType[]>([]);
    const [saveProgress, setSaveProgress] = useState<number>(0);

    const handleGetAllPohon = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await GetAllPohonByLHC(id);
            console.log(response);
            if (response.length > 0) {
                const cleanedResponse = response.map((pohon: PohonType) => {
                    return {
                        id: pohon.id,
                        nomor: pohon.nomor,
                        petak: pohon.petak.nama,
                        jalur: pohon.jalur,
                        arah_jalur: pohon.arah_jalur,
                        panjang_jalur: pohon.panjang_jalur,
                        jenis: pohon.jenis.nama,
                        diameter: pohon.diameter,
                        tinggi: pohon.tinggi,
                        volume: pohon.volume,
                        sortimen: pohon.sortimen.nama,
                        kelas_diameter: pohon.kelas_diameter ? `${pohon.kelas_diameter.nama}` : "",
                        koordinat_x: pohon.koordinat_x || null,
                        koordinat_y: pohon.koordinat_y || null,
                        status_pohon: pohon.status_pohon?.nama || null,
                        barcode: pohon.barcode?.barcode || null,

                    }
                });
                setListPohon(cleanedResponse);
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

    const handleGetAllJenis = async () => {
        const response = await GetAllJenis();
        // console.log('response all jenis', response)
        setListJenis(response);
    }



    const handleGetAllPetak = async () => {
        const response = await GetAllPetak(lhc?.tahun.tahun);
        // console.log('response all petak', response)
        setListPetak(response);
    }

    const handleGetDraftWorkbooks = async () => {
        if (!lhc) return;
        const response = await GetDraftSpreadsheets('lhc', lhc.id)
        console.log('response all workbooks draft', response)
        setDraftWorkbooks(response);
    }


    useEffect(() => {
        handleGetLHC();
        handleGetAllPohon();
        handleGetAllJenis();
        handleGetAllPetak();
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
                const formulaKelasDiameter = `=IF(${diameterCellAddress}<30,"10 - 29",IF(${diameterCellAddress}<40,"30 - 39",IF(${diameterCellAddress}<50,"40 - 49",IF(${diameterCellAddress}<60,"50 - 59","60 Up"))))`
                ref.updateCell({ formula: formula }, volumeCellAddress); // Update volume dengan formula
                ref.updateCell({ formula: formulaSortimen }, sortimenCellAddress); // Update sortimen dengan formula
                ref.updateCell({ format: '0.00' }, volumeCellAddress); // Format volume menjadi 2 desimal
                ref.updateCell({ formula: formulaKelasDiameter }, `L${rowIndex + 1}`); // Update kelas diameter
            }
        }

    }

    const defaultFormulas = [
        {
            cell: 'J2',
            formula: `=ROUND((0.7854*${FAKTOR_BENTUK})*H2^2*I2/10000,2)`,
            format: '0.00'
        },
        {
            cell: 'K2',
            formula: `=IF(H2<30,"KBK",IF(H2<50,"KBS","KB"))`
        },
        {
            cell: 'L2',
            formula: `=IF(H2<30,"10 - 29",IF(H2<40,"30 - 39",IF(H2<50,"40 - 49",IF(H2<60,"50 - 59","60 Up"))))`,
            format: "@"
        }
    ]

    const defaultFormats = [
        { format: "@", range: "A:A" }
    ]

    const isValidBarcodeOrNone = (barcode: string) => {
        if (!barcode) return null;
        if (barcode.trim().length === 27) {
            return barcode;
        } else {
            return null;
        }
    }



    const handleSaveToDatabase = async (data: { data: { rows: any[] }[] }) => {
        setLoading(true);
        console.log('data to clean', data);

        try {
            const cleanedData: LHCPohonSaveDatabaseType[] = data.data[0].rows.map((row: any) => {
                if (!row.jenis || !row.petak) {
                    message.error('Jenis dan Petak tidak boleh kosong');
                    throw new Error('Jenis dan Petak tidak boleh kosong');
                }
                const cleanedRow: LHCPohonSaveDatabaseType = {
                    nomor: parseInt(row.nomor),
                    volume: parseFloat(row.volume),
                    diameter: parseInt(row.diameter),
                    tinggi: parseInt(row.tinggi),
                    barcode: isValidBarcodeOrNone(row.barcode),
                    koordinat_x: row.koordinat_x ? parseFloat(row.koordinat_x) : null,
                    koordinat_y: row.koordinat_y ? parseFloat(row.koordinat_y) : null,
                    kelas_diameter_id: getKelasDiameterId(row.diameter),
                    jenis_id: getJenisId(row.jenis, listJenis),
                    petak_id: getPetakId(row.petak, listPetak),
                    sortimen_id: getSortimenId(row.diameter),
                    status_pohon_id: getStatusPohonId(row.diameter, row.jenis, listJenis),
                    jalur: row.jalur,
                    arah_jalur: row.arah_jalur,
                    panjang_jalur: row.panjang_jalur,
                };


                try {
                    cleanedRow.id = row.id;
                    if (cleanedRow.id === "") {
                        delete cleanedRow.id;
                    }
                } catch (error) {
                    console.error('Error:', error);
                }


                return cleanedRow;
            }).filter(row => row !== null); // Filter out invalid entries

            const chunks = chunkArray(cleanedData, BATCH_SIZE);
            const totalChunks = chunks.length;
            let x = 0;
            for (const chunk of chunks) {
                // mendapatkan persentase dari chunk yang sudah diproses
                x++; // Naikkan index karena chunk ini sedang diproses
                const percentage = Math.round((x / totalChunks) * 100);
                setSaveProgress(percentage);
                try {
                    console.log('chunk to save di database', chunk)
                    const response = await SaveLHCPohon(id, chunk);
                    console.log('response', response);
                    if (!response.success) {
                        message.error('Gagal menyimpan data, ' + response.detail);
                        setLoading(false);
                        return
                    }
                    // if (response.success) {
                    //     message.success('Batch data berhasil disimpan');
                    // } else {
                    //     message.error('Gagal menyimpan batch data: ' + response.detail);
                    // }
                } catch (error: any) {
                    console.log('Error saving batch', error);
                    message.error('Error saat menyimpan data: ' + error.message);
                }
            }
            handleGetAllPohon();
        } catch (error: any) {
            console.log('error', error);
            message.error('Kesalahan saat membersihkan data: ' + error.toString());
        }
        setLoading(false);
    };


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
            <LoadingModal open={loading} progress={saveProgress} />
            <SpreadSheets
                defaultFormulas={defaultFormulas}
                data={listPohon}
                className={s.spreadsheet_container}
                // onCellChanges={onCellChanges}
                onSaveAsJson={handleSaveToDatabase}
                defaultFormats={defaultFormats}
            />
        </div>
    );
}



