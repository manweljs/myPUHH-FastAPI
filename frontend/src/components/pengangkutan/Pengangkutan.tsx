"use client";
import React, { useEffect, useState } from 'react'
import { PageHeader } from '@/components/global'
import { useUserContext } from '@/hooks/UserContext'
import { ALAT_ANGKUT, FORMAT, PAGE } from '@/consts';
import styles from "./pengangkutan.module.sass"
import { DeleteDKBAngkutan, GetAllDKBAngkutan } from '@/api';
import { FormDKBAngkutan } from '../forms/FormDKBAngkutan';
import FIcon from '../global/FIcon';
import { Button, message, Popconfirm, Space, Table } from 'antd';
import { DKBAngkutanType } from '@/types';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'
import { ColumnsType } from 'antd/es/table';
import { getEnumLabel } from '@/functions';
import Link from 'next/link';

const page = PAGE.PENGANGKUTAN.TITLE;

export function Pengangkutan() {
    const { setPage } = useUserContext()
    const [displayForm, setDisplayForm] = useState(false)
    const [listAngkutan, setListAngkutan] = useState<DKBAngkutanType[]>([])
    const [dkbAngkutanId, setDkbAngkutanId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)


    const handleGetAll = async () => {
        setLoading(true)
        const response = await GetAllDKBAngkutan()
        console.log('response', response)
        setListAngkutan(response)
        setLoading(false)
    }

    useEffect(() => {
        handleGetAll()
        setPage(page);
    }, []);

    const handleAdd = () => {
        setDisplayForm(true)
    }

    const handleEdit = (id: string) => {
        setDkbAngkutanId(id)
        setDisplayForm(true)
    }

    const handleDelete = async (id: string) => {
        setLoading(true)
        const response = await DeleteDKBAngkutan(id)
        if (response) {
            message.success("Berhasil menghapus DKBAngkutan")
            handleGetAll()
        }
        setLoading(false)
    }

    const columns: ColumnsType = [
        {
            key: 'tanggal',
            title: 'Tanggal',
            dataIndex: 'tanggal',
            render: (tanggal: string) => dayjs(tanggal).format(FORMAT.DATE),
            width: 100
        },
        {
            key: 'nomor_dkb',
            title: 'Nomor DKB',
            dataIndex: 'nomor_dkb',
            render: (nomor_dkb: string, record: DKBAngkutanType) => <Link href={`/pengangkutan/${record.id}`}>{nomor_dkb}</Link>
        },

        {
            key: 'mutasi',
            title: 'Mutasi',
            render: (record: DKBAngkutanType) => {
                return (<Space>
                    <span>{record.tpk_asal.nama}</span>
                    <FIcon name='fi-rr-arrow-small-right' color='var(--primary)' />
                    <span>{record.tpk_tujuan.nama}</span>

                </Space>)
            }
        },

        {
            key: 'alat_angkut',
            title: 'Alat Angkut',
            dataIndex: 'alat_angkut',
            render: (alat_angkut: number) => <span>{getEnumLabel(ALAT_ANGKUT, alat_angkut)}</span>
        },
        {
            key: "nama_alat_angkut",
            title: "Nama Alat Angkut",
            dataIndex: "nama_alat_angkut"
        },
        {
            key: 'action',
            title: '',
            render: (record: DKBAngkutanType) => (
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

    return (
        <div className={styles.pengangkutan}>
            {displayForm &&
                <FormDKBAngkutan
                    open={displayForm}
                    id={dkbAngkutanId}
                    close={() => {
                        setDkbAngkutanId(null)
                        setDisplayForm(false)
                    }}
                    reload={handleGetAll}
                />
            }

            <PageHeader page={page} />

            <div className={styles.main}>
                <div className={styles.header + " mb-3"}>
                    <div className={styles.search}>
                        <FIcon name='fi-rr-search' />
                    </div>

                    <Button
                        type='primary'
                        onClick={handleAdd}
                    >+ Add</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={listAngkutan}
                    loading={loading}
                    rowKey="id"
                />
            </div>
        </div>
    )
}
