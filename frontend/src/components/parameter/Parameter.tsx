"use client";
import { Tabs } from 'antd'
import React, { useEffect } from 'react'
import "./setting.css"
import SettingBlok from './SettingBlok'
import { ParameterTahunKegiatan } from './ParameterTahunKegiatan'
import SettingPetak from './SettingPetak'
import SettingTPn from './SettingTPn'
import SettingTPK from './SettingTPK'
import SettingGanis from './SettingGanis'
import SettingPerusahaanPembeli from './SettingPerusahaanPembeli'
import SettingAlatAngkut from './SettingAlatAngkut'
import { ParameterPerusahaan } from './ParameterPerusahaan'
import { useUserContext } from '@/hooks/UserContext'
import { PAGE } from '@/consts'
import { PageHeader } from '@/components/global/PageHeader';


export function Parameter() {
    const { setPage } = useUserContext()

    useEffect(() => {
        setPage(PAGE.PARAMETER.TITLE)
    }, []);

    const items = [
        {
            key: "Perusahaan",
            label: "Perusahaan",
            children: <ParameterPerusahaan />
        },
        {
            key: "Tahun Kegiatan",
            label: "Tahun Kegiatan",
            children: <ParameterTahunKegiatan />
        },
        //     {
        //         key: "Blok",
        //         label: "Blok",
        //         children: <SettingBlok />
        //     },
        //     {
        //         key: "Petak",
        //         label: "Petak",
        //         children: <SettingPetak />
        //     },
        //     {
        //         key: "TPn",
        //         label: "TPn",
        //         children: <SettingTPn />
        //     },
        //     {
        //         key: "TPK ",
        //         label: "TPK ",
        //         children: <SettingTPK />
        //     },
        //     {
        //         key: "Ganis",
        //         label: "Ganis",
        //         children: <SettingGanis />
        //     },
        //     {
        //         key: "Buyer",
        //         label: "Perusahaan Pembeli",
        //         children: <SettingPerusahaanPembeli />
        //     },
        //     {
        //         key: "alatangkut",
        //         label: "Alat Angkut",
        //         children: <SettingAlatAngkut />
        //     },

    ]
    return (
        <div className="setting">
            <div className="main">
                <PageHeader page={PAGE.PARAMETER.TITLE} />
                <Tabs
                    tabPosition='left'
                    className='setting-tab'
                    items={items}
                />
            </div>
        </div>
    )
}
