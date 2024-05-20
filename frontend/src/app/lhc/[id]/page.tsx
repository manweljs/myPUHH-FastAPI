import LHCDetail from '@/components/lhc/LHCDetail'
import React from 'react'
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-dropdowns/styles/material.css';
import '@syncfusion/ej2-grids/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-lists/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import "@syncfusion/ej2-splitbuttons/styles/material.css";
import '@syncfusion/ej2-calendars/styles/material.css';
import '@syncfusion/ej2-react-pivotview/styles/material.css';

export default function page(props: { params: { id: string } }) {
    const { params } = props
    return (
        <LHCDetail id={params.id} />
    )
}
