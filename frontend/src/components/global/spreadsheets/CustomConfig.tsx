"use client";
import { SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";
import { ClickEventArgs, ItemModel } from '@syncfusion/ej2-navigations';
import { SPREADSHEET_TOOLBAR_ITEMS as t } from "@/consts"
import SpreadsheetService from "./SpreadsheetService";

const spreadsheetService = SpreadsheetService.getInstance();

export const customizeRibbon = () => {
    const { spreadsheet } = spreadsheetService
    if (!spreadsheet) return;
    spreadsheet.hideRibbonTabs([]);
    spreadsheet.enableRibbonTabs(['View']);
    spreadsheet.hideToolbarItems('Home', [
        t.MERGE_CELLS,
        t.CONDITIONAL_FORMATTING,
        t.BORDERS,
        t.TEXT_COLOR,
        t.SEPARATOR_6,
        t.FILL_COLOR,
        t.VERTICAL_ALIGNMENT,
        t.WRAP_TEXT,
        t.SEPARATOR_8,
        t.CLEAR,

    ]);



    spreadsheet.addToolbarItems('Home', CustomToolbars(), -1);


}

export const customizeFormat = () => {
    const { spreadsheet } = spreadsheetService
    if (!spreadsheet) return;
    spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'left' }, 'A1:BB1');

}




const CustomToolbars = () => {
    const toolbars = [
        {
            tooltipText: 'Auto Sum',
            click: (args: ClickEventArgs) => {
                args.originalEvent.NONE;
                handleAutoSum(args);
                // You can add custom toolbars here.
            },
            prefixIcon: 'fi fi-rr-total',
            cssClass: 'e-custom-button'
        }
    ]

    return toolbars

}

const handleAutoSum = (args: ClickEventArgs) => {
    const { spreadsheet } = spreadsheetService;
    if (!spreadsheet) return;
    const cell = spreadsheet.activeSheetIndex
    console.log('cell', cell)

}