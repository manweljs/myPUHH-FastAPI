"use client";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/global";
import { DeleteLHC, GetAllLHC } from "@/api";
import {
    Button,
    Flex,
    Popconfirm,
    Space,
    Table,
    TableProps,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import style from "./lhc.module.sass";
import { useUserContext } from "@/hooks/UserContext";
import { LHCType, TahunKegiatanType } from "@/types";
import Link from "next/link";
import { PAGE } from "@/consts";
import { GetAllTahunKegiatan } from "@/api";
import { FormLHC } from "../forms/FormLHC";

const dateFormat = "YYYY-MM-DD";
const page = "LHC";
document.title = page;

export default function LHC() {
    const { setPage } = useUserContext();
    const [objects, setObjects] = useState<LHCType[]>([]);
    const [objectId, setObjectId] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [displayForm, setDisplayForm] = useState(false);

    const handleGetAll = async () => {
        const response = await GetAllLHC();
        console.log(response);
        setObjects(response);
        setLoading(false);
    };

    useEffect(() => {
        setPage(page);
        handleGetAll();
    }, [setPage]);


    const columns: TableProps["columns"] = [
        {
            key: "nomor",
            title: "nomor",
            dataIndex: "nomor",
            render: (nomor: string, record: LHCType) => <Link href={`${PAGE.LHC.URL}/${record.id}`}>{nomor}</Link>,
        },
        {
            key: "tanggal",
            title: "tanggal",
            dataIndex: "tanggal",
            render: (tanggal: string) => <span>{dayjs(tanggal).format("DD MMMM YYYY")}</span>,
        },
        {
            key: "tahun",
            title: "Tahun Kegiatan",
            dataIndex: "tahun",
        },
        {
            key: "blok",
            title: "Blok Kerja",
            dataIndex: "blok",
        },
        {
            key: "obyek",
            title: "obyek",
            dataIndex: "obyek",
            render: (obyek: number) => (
                <span>{obyek === 0 ? "Blok / Petak" : "Trase Jalan"}</span>
            ),
        },
        {
            key: "pohon",
            title: "Total Pohon",
            dataIndex: "total_pohon",
            render: (total_pohon: any) => (
                <span>{total_pohon.toLocaleString()}</span>
            ),
        },
        {
            key: "volume",
            title: "Volume (m3)",
            dataIndex: "total_volume",
            render: (total_volume: any) => (
                <span>{total_volume ? total_volume.toLocaleString() : 0}</span>
            ),
        },
        {
            key: "action",
            title: "",
            render: (record: LHCType) => (
                <div className="action">
                    <EditOutlined onClick={() => record.id && handleEdit(record.id)} />
                    <Popconfirm
                        placement="bottomRight"
                        title={"Hapus LHC"}
                        description={`Apakah anda yakin menghapus LHC ini ?`}
                        onConfirm={() => record.id && handleDelete(record.id)}
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

    const handleClose = () => {
        setDisplayForm(false);
        setObjectId(null);
    };

    const handleAdd = () => {
        setDisplayForm(true);
    };

    const handleEdit = (id: string) => {
        if (!id) return;
        setObjectId(id);
        setDisplayForm(true);
    };

    const handleDelete = async (id: string) => {
        const response = await DeleteLHC(id);
        console.log(response);
        response.status && handleGetAll();
    };

    return (
        <div className="lhc">
            <PageHeader page={page} />
            <div className={style.main}>
                <div className={`${style.header} mb-3`}>
                    <div className="search">
                        <SearchOutlined />
                    </div>
                    <Button type="primary" onClick={handleAdd}>
                        + Add
                    </Button>
                </div>

                <Table
                    className="table-rkt"
                    columns={columns}
                    dataSource={objects}
                    loading={loading}
                    rowKey={"id"}
                />

                {displayForm && (
                    <FormLHC
                        id={objectId}
                        close={handleClose}
                        reload={handleGetAll}
                        open={displayForm}
                    />
                )}
            </div>
        </div>
    );
}
