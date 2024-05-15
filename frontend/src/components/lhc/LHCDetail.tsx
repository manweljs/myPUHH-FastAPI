"use client"
import React, { useEffect, useState } from "react";
import { GetLHC } from "@/api";
import { Tabs, TabsProps, } from "antd";
import s from "./lhc.module.sass";
import { LHCType } from "@/types";
import { PageHeader } from "../global";
import { LHCDetailBarcodes } from "./LHCDetailBarcodes";
import LHCDetailPohon from "./LHCDetailPohon";
import LHCDetailSummary from "./LHCDetailSummary";
import { getEnumLabel } from "@/functions";
import { OBYEK } from "@/consts";

export default function LHCDetail(props: {
    id: string
}) {
    const { id } = props;
    const [lhc, setLHC] = useState<LHCType | null>(null);
    const [pageTitle, setPageTitle] = useState("LHC/");


    const handleGetLHC = async () => {
        if (!id) return;
        const response = await GetLHC(id);
        console.log(response);
        setLHC(response);
    };

    useEffect(() => {
        handleGetLHC();
    }, []);

    useEffect(() => {
        if (!lhc) return;
        setPageTitle(`LHC - ${lhc?.nomor} - ${getEnumLabel(OBYEK, lhc.obyek)}`);
    }, [lhc]);

    const items: TabsProps['items'] = [
        {
            key: '0',
            label: 'Summary',
            children: <LHCDetailSummary data={lhc} />,
        },
        {
            key: '1',
            label: 'Barcode',
            children: <LHCDetailBarcodes id={id} />,
        },
        {
            key: '2',
            label: 'Pohon',
            children: <LHCDetailPohon id={id} />,
        },
    ]

    return (
        <div className={s.lhc_detail}>
            <PageHeader back={"/lhc"} page={pageTitle} />
            <Tabs
                className={s.lhc_detail_tabs}
                items={items}
                tabPosition="left"
            />
        </div>
    );
}


