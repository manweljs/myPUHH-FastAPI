"use client";
import { Tabs } from 'antd'
import React, { useEffect } from 'react'
import "./setting.css"
import { ParameterTahunKegiatan } from './ParameterTahunKegiatan'
import SettingPetak from './ParameterPetak'
import SettingTPn from './SettingTPn'
import { ParameterTPK } from './ParameterTPK'
import SettingGanis from './SettingGanis'
import SettingPerusahaanPembeli from './SettingPerusahaanPembeli'
import SettingAlatAngkut from './SettingAlatAngkut'
import { ParameterPerusahaan } from './ParameterPerusahaan'
import { useUserContext } from '@/hooks/UserContext'
import { PAGE } from '@/consts'
import { PageHeader } from '@/components/global/PageHeader';
import { ParameterBlok } from './ParameterBlok';
import ParameterPetak from './ParameterPetak';


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
        {
            key: "Blok",
            label: "Blok",
            children: <ParameterBlok />
        },
        {
            key: "Petak",
            label: "Petak",
            children: <ParameterPetak />
        },
        //     {
        //         key: "TPn",
        //         label: "TPn",
        //         children: <SettingTPn />
        //     },
        {
            key: "TPK ",
            label: "TPK ",
            children: <ParameterTPK />
        },
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
