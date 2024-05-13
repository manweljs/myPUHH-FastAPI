"use client";
import React, { useEffect, useState } from 'react';
import { PageHeader } from '../global/PageHeader';
import { message, Button, Popconfirm, Table } from 'antd';
import dayjs from 'dayjs';
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import styles from "./rencana-tebang.module.sass"
import { useUserContext } from '@/hooks/UserContext';
import { DeleteRencanaTebang, GetAllRencanaTebang, } from '@/api';
import { RencanaTebangType } from '@/types';
import Link from 'next/link';
import { OBYEK, PAGE } from '@/consts';
import { FormRencanaTebang } from '../forms/FormRencanaTebang';

const page = PAGE.RENCANA_TEBANG.TITLE;
document.title = page


export default function RencanaTebang() {
    const { setPage } = useUserContext()
    const [listRencanaTebang, setListRencanaTebang] = useState<RencanaTebangType[]>([])
    const [rencanaTebangId, setRencanaTebangId] = useState<string | null>(null)

    const [loading, setLoading] = useState(true)
    const [displayForm, setDisplayForm] = useState(false)

    const handleGetAll = async () => {
        setLoading(true)
        const response = await GetAllRencanaTebang()
        console.log(response)
        setListRencanaTebang(response)
        setLoading(false)
    }

    useEffect(() => {
        setPage(page);
        handleGetAll()
    }, []);


    const columns = [
        {
            key: 'nomor',
            title: 'nomor',
            dataIndex: 'nomor',
            render: (nomor: string, record: RencanaTebangType) => <Link href={"/rencana-tebang/" + record.id}>{nomor}</Link>
        },
        {
            key: 'obyek',
            title: 'obyek',
            dataIndex: 'obyek',
            render: (obyek: number) => <span>{obyek === OBYEK.BLOK_PETAK ? "Petak / Blok" : "Trase Jalan"}</span>
        },
        {
            key: 'tanggal',
            title: 'tanggal',
            dataIndex: 'tanggal',
            render: (tanggal: string) => (
                tanggal &&
                <span>{dayjs(tanggal).format("DD MMM YYYY")}</span>
            )
        },
        {
            key: 'tahun',
            title: 'Tahun Kegiatan',
            render: (record: RencanaTebangType) => <span>{record.tahun.tahun}</span>
        },
        {
            key: 'fe',
            title: 'Faktor Exploitasi',
            dataIndex: 'faktor',
        },
        {
            key: 'pohon',
            title: 'total pohon',
            dataIndex: 'pohon',
        },
        {
            key: 'volume',
            title: 'total volume (m3)',
            dataIndex: 'volume',
        },
        {
            key: 'action',
            title: '',
            render: (record: RencanaTebangType) => (
                <div className="action">
                    <EditOutlined onClick={() => record.id && handleEdit(record.id)} />
                    <Popconfirm
                        placement="bottomRight"
                        title={"Hapus LHC"}
                        description={`Apakah anda yakin menghapus Rencana Tebang ini ?`}
                        onConfirm={() => record.id && handleDelete(record.id)}
                        okText="Hapus"
                        cancelText="Batal"
                    >
                        <DeleteOutlined />
                    </Popconfirm>
                </div>
            ),
            width: 80
        },
    ]

    const handleClose = () => {
        setDisplayForm(false)
        setRencanaTebangId(null)
    }

    const handleAdd = () => {
        setDisplayForm(true)

    }

    const handleEdit = (id: string) => {
        if (!id) return
        setRencanaTebangId(id)
        setDisplayForm(true)
    }

    const handleDelete = async (id: string) => {
        const response = await DeleteRencanaTebang(id)
        console.log(response)
        if (response.success) {
            handleGetAll()
            message.success("Rencana Tebang Dihapus!")
        }
    }

    return (
        <div className={styles.rencana_tebang}>
            <PageHeader page={page} />
            <div className={styles.main}>
                <div className={`${styles.header} mb-3`}>
                    <div className="search">
                        <SearchOutlined />
                    </div>
                    <Button
                        type='primary'
                        onClick={handleAdd}
                    >+ Add</Button>
                </div>

                <Table
                    className='table-rkt'
                    columns={columns}
                    dataSource={listRencanaTebang}
                    loading={loading}
                    rowKey='id'
                />

                {displayForm &&
                    <FormRencanaTebang
                        id={rencanaTebangId}
                        close={handleClose}
                        reload={handleGetAll}
                        open={displayForm}
                    />
                }
            </div>
        </div >
    )
}

