// File: SpreadsheetService.ts
import { SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet';

class SpreadsheetService {
    private static instance: SpreadsheetService;
    private _spreadsheet: SpreadsheetComponent | null = null;

    private constructor() { }

    public static getInstance(): SpreadsheetService {
        if (!SpreadsheetService.instance) {
            SpreadsheetService.instance = new SpreadsheetService();
        }
        return SpreadsheetService.instance;
    }

    set spreadsheet(spreadsheet: SpreadsheetComponent | null) {
        this._spreadsheet = spreadsheet;
    }

    get spreadsheet(): SpreadsheetComponent | null {
        return this._spreadsheet;
    }

    public performCalculation(): void {
        if (!this._spreadsheet) {
            console.error("Spreadsheet is not initialized");
            return;
        }
        // Perform calculations or manipulations here
    }
}

export default SpreadsheetService;
