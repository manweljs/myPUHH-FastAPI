"use client";
import React, { useEffect, useState } from 'react'
import { PageHeader } from '@/components/global'
import styles from "./lhp.module.sass"
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons"
import { Button, Popconfirm, Table } from 'antd'
import { useUserContext } from '@/hooks/UserContext'
import { LHPType } from '@/types'
import { PAGE } from '@/consts';
import { DeleteLHP, GetAllLHP } from '@/api';
import { FormLHP } from '../forms/FormLHP';
import FIcon from '../global/FIcon';
import Link from 'next/link';

const page = PAGE.LHP.TITLE;

export function LHP() {
    const { setPage } = useUserContext()

    const [lhpID, setLhpID] = useState<string | null>(null)
    const [listLHP, setListLHP] = useState<LHPType[]>([])
    const [loading, setLoading] = useState(true)
    const [displayForm, setDisplayForm] = useState(false)

    useEffect(() => {
        setPage(page)

    }, []);

    const handleGetAll = async () => {
        setLoading(true)
        const response = await GetAllLHP()
        setListLHP(response)
        setLoading(false)
    }


    const handleEdit = async (id: string) => {
        setLhpID(id)
        setDisplayForm(true)
    }

    const handleAdd = async () => {
        setDisplayForm(true)
    }

    const handleDelete = async (id: string) => {
        const response = await DeleteLHP(id)
        if (response.success) {
            setListLHP((prev) => prev.filter((item) => item.id !== id))
        }
    }

    useEffect(() => {
        handleGetAll()
    }, [])

    const columns = [
        {
            key: 'nomor',
            title: 'nomor',
            dataIndex: 'nomor',
            render: (text: string, record: LHPType) => <span>{<Link href={`/lhp/${record.id}`}>{text}</Link>}</span>
        },
        {
            key: 'tahun',
            title: 'Tahun Kegiatan',
            render: (record: LHPType) => <span>{record.tahun.tahun}</span>
        },
        {
            key: 'tanggal',
            title: 'Tanggal LHP',
            dataIndex: 'tanggal',
        },
        {
            key: 'action',
            title: '',
            render: (record: LHPType) => (
                <div className="action">
                    <EditOutlined onClick={() => record.id && handleEdit(record.id)} />
                    <Popconfirm
                        placement="bottomRight"
                        title={"Hapus Blok"}
                        description={"Apakah anda yakin menghapus LHP ini ?"}
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
        <div className={styles.lhp}>
            {displayForm &&
                <FormLHP
                    open={displayForm}
                    id={lhpID}
                    close={() => {
                        setLhpID(null)
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
                    dataSource={listLHP}
                    loading={loading}
                    rowKey="id"
                />
            </div>


        </div>
    )
}
