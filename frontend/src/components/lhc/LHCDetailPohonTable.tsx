"use client"
import React, { useEffect, useState } from "react";
import { GetLHC, GetLHCDetails } from "@/api";
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import {
    Button,
    Popconfirm,
    Table,
} from "antd";
import ModalImportPohon from "./ModalImportPohon";
import style from "./lhc.module.sass";
import { LHCType, PohonType } from "@/types";
import { PageHeader } from "../global";
import { CustomPagination } from "../global/CustomPagination";

export default function LHCDetailPohon(props: {
    id: string
}) {
    const { id } = props;
    const [lhc, setLHC] = useState<LHCType | null>(null);
    const [listPohon, setListPohon] = useState<PohonType[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showImportModal, setShowImportModal] = useState(false);
    const [tableHeight, setTableHeight] = useState(window.innerHeight - 200);
    const [pageTitle, setPageTitle] = useState("LHC");

    const handleGetLHCDetail = async (page = 1) => {
        if (!id) return;
        setLoading(true);
        const response = await GetLHCDetails(id, page);
        console.log(response);
        setListPohon(response.results);
        setCount(response.count);
        setLoading(false);
    };

    const handleGetLHC = async () => {
        if (!id) return;
        const response = await GetLHC(id);
        console.log(response);
        setLHC(response.data);
    };

    useEffect(() => {
        handleGetLHC();
        handleGetLHCDetail();
    }, []);

    const handleImport = () => {
        setShowImportModal(true);
    };

    const handleEdit = (id: string) => { };
    const handleDelete = (id: string) => { };

    const columns = [
        {
            key: "nomor",
            title: "nomor",
            dataIndex: "nomor",
            width: 80,
        },
        {
            key: "barcode",
            title: "barcode",
            dataIndex: "barcode",
            width: 250,
        },
        {
            key: "petak",
            title: "petak",
            dataIndex: "petak",
            width: 80,
        },
        {
            key: "jalur",
            title: "jalur",
            dataIndex: "jalur",
            width: 70,
        },
        {
            key: "panjang_jalur",
            title: "panjang jalur",
            dataIndex: "panjang_jalur",
            width: 120,
        },
        {
            key: "arah_jalur",
            title: "arah jalur",
            dataIndex: "arah_jalur",
            width: 100,
        },
        {
            key: "jenis",
            title: "jenis",
            dataIndex: "jenis",
        },
        {
            key: "kelompok_jenis",
            title: "kelompok jenis",
            dataIndex: "kelompok_jenis",
        },
        {
            key: "diameter",
            title: "diameter",
            dataIndex: "diameter",
            width: 100,
        },
        {
            key: "tinggi",
            title: "tinggi",
            dataIndex: "tinggi",
            width: 100,
        },
        {
            key: "volume",
            title: "volume",
            dataIndex: "volume",
            width: 100,
        },
        {
            key: "koordinat_x",
            title: "koordinat x",
            dataIndex: "koordinat_x",
        },
        {
            key: "koordinat_y",
            title: "koordinat y",
            dataIndex: "koordinat_y",
        },
        {
            key: "action",
            title: "",
            render: (record: PohonType) => (
                <div className="action">
                    <EditOutlined onClick={() => handleEdit(record.id)} />
                    <Popconfirm
                        placement="bottomRight"
                        title={"Hapus LHC"}
                        description={`Apakah anda yakin menghapus LHC ini ?`}
                        onConfirm={() => handleDelete(record.id)}
                        okText="Hapus"
                        cancelText="Batal"
                    >
                        <DeleteOutlined />
                    </Popconfirm>
                </div>
            ),
            width: 80,
        },
    ];

    const handlePageChange = (page: number) => {
        console.log(page);
        handleGetLHCDetail(page);
    };

    useEffect(() => {
        const handleResize = () => {
            setTableHeight(window.innerHeight - 200);
        };
        window.addEventListener("resize", handleResize);

        if (lhc) {
            const pageTitle = `LHC - ${lhc?.nomor} (${lhc?.obyek === 1 ? "Petak / Blok" : "Trase Jalan"})`;
            setPageTitle(pageTitle);
        }

        return () => window.removeEventListener("resize", handleResize);
    }, [window.innerHeight, lhc]);



    return (
        <div className={style.lhc_detail}>
            <div className={style.main}>
                <div className={style.header}>
                    <div className={style.search_box}>
                        <SearchOutlined />
                    </div>
                    <Button type="primary" onClick={handleImport}>
                        + Import
                    </Button>
                </div>
                <div className={style.table + " mt-2"}>
                    <Table
                        loading={loading}
                        scroll={{ y: tableHeight }}
                        columns={columns}
                        dataSource={listPohon}
                        size="small"
                        pagination={false}
                    />
                    {listPohon?.length > 0 && (
                        <CustomPagination count={count} onChange={handlePageChange} />
                    )}
                </div>
            </div>
            <ModalImportPohon
                lhcId={lhc?.id}
                open={showImportModal}
                close={() => setShowImportModal(false)}
                reload={() => handleGetLHCDetail()}
            />
        </div>
    );
}


