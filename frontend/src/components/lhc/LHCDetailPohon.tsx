"use client"
import React, { useEffect, useState } from "react";
import { GetAllJenis, GetAllPohonByLHC, GetLHC, GetPresignedUrl, SaveLHCPohon } from "@/api";
import s from "./lhc.module.sass";
import { DraftSpreadsheetType, JenisPohonType, LHCPohonInType, LHCType, PohonInType, PohonType } from "@/types";
import { LoadingModal, SpreadSheets } from "../global";
import { SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";
import { getJenisId, getKelasDiameterId, sanitizeFilename } from "@/functions";
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
                        kelas_diameter: pohon.kelas_diameter ? `'${pohon.kelas_diameter.nama}` : "",
                        koordinat_x: pohon.koordinat_x || null,
                        koordinat_y: pohon.koordinat_y || null,
                        status_pohon: pohon.status_pohon || null,
                        barcode: pohon.barcode || null,
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
        console.log('response all jenis', response)
        setListJenis(response);
    }

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
        handleGetAllJenis();
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
                const cleanedRow: LHCPohonInType = {
                    ...row,
                    volume: parseFloat(row.volume),
                    diameter: parseInt(row.diameter),
                    tinggi: parseInt(row.tinggi),
                    barcode: isValidBarcodeOrNone(row.barcode),
                    koordinat_x: row.koordinat_x ? parseFloat(row.koordinat_x) : null,
                    koordinat_y: row.koordinat_y ? parseFloat(row.koordinat_y) : null,
                    kelas_diameter: row.kelas_diameter.replace("'", ""),
                };

                // Hanya tambahkan properti id jika tidak kosong atau null
                if (row.id) {
                    console.log('row.id ada', row.id)
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
                if (response.success) {
                    message.success('Data berhasil disimpan')
                    handleGetAllPohon();
                } else {
                    message.error(response.detail)
                }

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
                defaultFormulas={defaultFormulas}
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



