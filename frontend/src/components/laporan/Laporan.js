import React, { useEffect } from 'react'
import PageHeader from '../global/PageHeader'
import { useUser } from '../../UserContext'

const page = "Laporan"
document.title = page
export default function Laporan() {
    const { setPage } = useUser()


    useEffect(() => {
        setPage(page);
    }, [setPage]);
    return (
        <div className="laporan">
            <div className="main">
                <PageHeader page={page} />
            </div>
        </div>
    )
}
