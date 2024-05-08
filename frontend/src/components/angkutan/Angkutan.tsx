import React, { useEffect } from 'react'
import PageHeader from '../global/PageHeader'
import { useUser } from '../../UserContext'


const page = "Pengangkutan"
document.title = page

export default function Angkutan() {
    const { setPage } = useUser()

    useEffect(() => {
        setPage(page);
    }, [setPage]);

    return (
        <div className="angkutan">
            <div className="main">
                <PageHeader page={page} />
            </div>
        </div>
    )
}
