import { BeforeSaveEventArgs, SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";
import * as XLSX from 'xlsx';

const downloadExcel = (allSheetsData: { name: string, data: any[][] }[], fileName: string) => {
    const workbook = XLSX.utils.book_new();
    allSheetsData.forEach(sheet => {
        const worksheet = XLSX.utils.aoa_to_sheet(sheet.data);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
    });
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

const downloadCSV = (data: string[][], filename: string = 'spreadsheet.csv'): void => {
    let csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const SaveAsExcel = async (spreadsheet: SpreadsheetComponent, args: BeforeSaveEventArgs) => {

    const fileName = args.fileName || 'spreadsheet';

    const allSheetsData = extractExcelData(spreadsheet);

    downloadExcel(allSheetsData, fileName);
    return
}


export const SaveAsJson = async (spreadsheet: SpreadsheetComponent, args: BeforeSaveEventArgs, callback: (data: any) => void) => {
    const allSheetsData = await extractJsonData(spreadsheet);
    console.log('allSheetsData', allSheetsData)
    callback && callback(allSheetsData);
    return

};


const extractJsonData = async (spreadsheet: SpreadsheetComponent) => {
    console.log('spreadsheet', spreadsheet);

    const formattedData = {
        data: spreadsheet.sheets.map((sheet: any) => {
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

const extractExcelData = (spreadsheet: SpreadsheetComponent) => {
    const allSheetsData: { name: string, data: any[][], styles?: any[] }[] = [];
    spreadsheet.sheets.forEach((sheet: any) => {
        const rows = sheet.rows || sheet.properties.rows;
        const sheetName = sheet.name || sheet.properties.name;
        const sheetData: any[][] = [];
        const wbStyles: any[] = [];

        rows.forEach((row: any, rowIndex: number) => {
            const rowData: any[] = [];
            row.cells.forEach((cell: any, colIndex: number) => {
                const cellData = cell ? (cell.formula ? { f: cell.formula } : cell.value) : "";
                rowData.push(cellData);
                if (cell && cell.style) {
                    wbStyles.push({ row: rowIndex, col: colIndex, style: cell.style });
                }
            });
            sheetData.push(rowData);
        });

        allSheetsData.push({ name: sheetName, data: sheetData, styles: wbStyles });
    });
    return allSheetsData;
}

// TODO: Implement open excel manually 
export const OpenExcelFile = (setData: (data: any) => void, file: File, columns?: any) => {
    console.log('columns', columns)
    if (!file) return;
    console.log('masuk sini', file)
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
        const buffer = event.target?.result as ArrayBuffer;
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const worksheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[worksheetName];
        let parsedData = XLSX.utils.sheet_to_json(worksheet);

        if (columns) {
            console.log('parse sesuai columns')
            parsedData = normalizeData(parsedData, columns);
        }
        console.log('parsedData', parsedData)
        setData(parsedData); // Update state with the parsed data
    };
    reader.readAsArrayBuffer(file);
};

const normalizeData = (data: any[], columns: any) => {
    return data.map(item => {
        const normalizedItem: any = {}; // Add index signature to allow indexing with a string
        for (const key in columns) {
            normalizedItem[key] = item[key] ?? columns[key];
        }
        return normalizedItem;
    });
};

const defaultData: object[] = [
    { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, ShipCity: 'Reims' },
    { OrderID: 10249, CustomerID: 'TOMSP', EmployeeID: 6, ShipCity: 'Münster' },
    { OrderID: 10250, CustomerID: 'HANAR', EmployeeID: 4, ShipCity: 'Lyon' }
];