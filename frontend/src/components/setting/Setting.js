import { Tabs } from 'antd'
import React, { useEffect } from 'react'
import PageHeader from '../global/PageHeader'
import "./setting.css"
import SettingBlok from './SettingBlok'
import SettingRKT from './SettingRKT'
import SettingPetak from './SettingPetak'
import SettingTPn from './SettingTPn'
import SettingTPK from './SettingTPK'
import SettingGanis from './SettingGanis'
import SettingPerusahaanPembeli from './SettingPerusahaanPembeli'
import SettingAlatAngkut from './SettingAlatAngkut'
import SettingPerusahaan from './SettingPerusahaan'
import { useUser } from 'UserContext'

const page = "Setting"
document.title = page

export default function Setting() {
    document.title = page
    const { setPage } = useUser()
    setPage(page)

    const items = [
        {
            key: "Perusahaan",
            label: "Perusahaan",
            children: <SettingPerusahaan />
        },
        {
            key: "RKT",
            label: "RKT",
            children: <SettingRKT />
        },
        {
            key: "Blok",
            label: "Blok",
            children: <SettingBlok />
        },
        {
            key: "Petak",
            label: "Petak",
            children: <SettingPetak />
        },
        {
            key: "TPn",
            label: "TPn",
            children: <SettingTPn />
        },
        {
            key: "TPK ",
            label: "TPK ",
            children: <SettingTPK />
        },
        {
            key: "Ganis",
            label: "Ganis",
            children: <SettingGanis />
        },
        {
            key: "Buyer",
            label: "Perusahaan Pembeli",
            children: <SettingPerusahaanPembeli />
        },
        {
            key: "alatangkut",
            label: "Alat Angkut",
            children: <SettingAlatAngkut />
        },

    ]
    return (
        <div className="setting">
            <div className="main">
                <PageHeader page={page} />
                <Tabs
                    tabPosition='left'
                    className='setting-tab'
                    items={items}
                />
            </div>
        </div>
    )
}
