import React, { useEffect } from 'react'
import PageHeader from '../global/PageHeader'
import { useUser } from '../../UserContext'

const page = "Stok"
document.title = page

export default function Stok() {

    const { setPage } = useUser()


    useEffect(() => {
        setPage(page);
    }, [setPage]);
    return (
        <div className="stok">
            <div className="main">
                <PageHeader page={page} />
            </div>
        </div>
    )
}
