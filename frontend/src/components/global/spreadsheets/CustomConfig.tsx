"use client";
import { addToolbarItems, SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";
import { ClickEventArgs, ItemModel } from '@syncfusion/ej2-navigations';
import { SPREADSHEET_TOOLBAR_ITEMS as t } from "@/consts"


export const customizeRibbon = (spreadsheet: SpreadsheetComponent) => {

    if (!spreadsheet) return;
    // spreadsheet.hideRibbonTabs([]);
    // spreadsheet.enableRibbonTabs(['View']);
    // spreadsheet.hideToolbarItems('Home', [
    //     t.MERGE_CELLS,
    //     t.CONDITIONAL_FORMATTING,
    //     t.BORDERS,
    //     t.TEXT_COLOR,
    //     t.SEPARATOR_6,
    //     t.FILL_COLOR,
    //     t.VERTICAL_ALIGNMENT,
    //     t.WRAP_TEXT,
    //     t.SEPARATOR_8,
    //     t.CLEAR,

    // ]);


    console.log('ini dipanggil')

    // spreadsheet.addToolbarItems('Home', CustomToolbars(spreadsheet), -1);
    spreadsheet.addRibbonTabs([{
        header: { text: 'Rumus' }, content: [{
            text: 'VolumeLHC', tooltipText: 'Volume LHC',
            click: (e) => {
                console.log('e', e)
            }
        }]
    }]);


}

export const customizeFormat = (spreadsheet: SpreadsheetComponent) => {
    if (!spreadsheet) return;
    spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'left' }, 'A1:BB1');

}

export const setDefaultFormulas = (spreadsheet: SpreadsheetComponent, defaultFormulas: { cell: string, formula: string, format?: string }[]) => {
    if (!spreadsheet) return;
    defaultFormulas.forEach(({ cell, formula, format }) => {
        const [col, row] = cell.split(/(\d+)/).filter(Boolean);
        spreadsheet.updateCell({ formula, format }, `${col}${row}`);
    });
}




const CustomToolbars = (spreadsheet: SpreadsheetComponent) => {

    const toolbars = [
        {
            tooltipText: 'Auto Sum',
            click: (args: ClickEventArgs) => {
                args.originalEvent.NONE;
                handleAutoSum(spreadsheet, args);
                // You can add custom toolbars here.
            },
            prefixIcon: 'fi fi-rr-total',
            cssClass: 'e-custom-button'
        }
    ]

    return toolbars

}

const handleAutoSum = (spreadsheet: SpreadsheetComponent, args: ClickEventArgs) => {
    if (!spreadsheet) return;
    const cell = spreadsheet.activeSheetIndex
    console.log('cell', cell)

}