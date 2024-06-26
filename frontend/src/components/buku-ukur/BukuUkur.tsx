"use client";
import React, { useEffect, useState } from 'react'
import style from "./buku-ukur.module.sass"
import { SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { DeleteBukuUkur, GetAllBukuUkur } from '@/api'
import { Button, Popconfirm, Table, message } from 'antd'
import { FormBukuUkur } from '@/components/forms/FormBukuUkur'
import dayjs from 'dayjs'
import { BukuUkurType } from '@/types'
import { useUserContext } from '@/hooks/UserContext';
import Link from 'next/link';
import { PAGE } from '@/consts';
import { PageHeader } from '@/components/global/PageHeader';
import FIcon from '../global/FIcon';
const page = PAGE.BUKU_UKUR.TITLE

export default function BukuUkur() {
    const { setPage } = useUserContext()
    const [objects, setObjects] = useState<BukuUkurType[]>([])
    const [objectId, setObjectId] = useState<string | null>(null)

    const [loading, setLoading] = useState(true)
    const [displayForm, setDisplayForm] = useState(false)

    const handleGetAll = async () => {
        setLoading(true)
        const response = await GetAllBukuUkur()
        // console.log(response)
        setObjects(response)
        setLoading(false)
    }

    const columns = [
        {
            key: 'nomor',
            title: 'nomor',
            dataIndex: 'nomor',
            render: (nomor: string, record: BukuUkurType) => <Link href={`${PAGE.BUKU_UKUR.URL}/${record.id}`}>{nomor}</Link>

        },
        {
            key: 'tahun',
            title: 'Tahun Kegiatan',
            render: (record: BukuUkurType) => <span>{record.tahun.tahun}</span>,
        },


        {
            key: 'tanggal',
            title: 'Tanggal',
            dataIndex: 'tanggal',
            render: (tanggal: string) => <span>{dayjs(tanggal).format("DD/MM/YYYY")}</span>
        },
        {
            key: 'action',
            title: '',
            render: (record: BukuUkurType) => (
                <div className="action">
                    <EditOutlined onClick={() => record.id && handleEdit(record.id)} />
                    <Popconfirm
                        placement="bottomRight"
                        title={`Hapus ${page}`}
                        description={`Apakah anda yakin menghapus ${page} ini ?`}
                        onConfirm={() => record.id && handleDelete(record.id)}
                        okText="Hapus"
                        cancelText="Batal"
                        okButtonProps={{ loading: loading }}
                    >
                        <DeleteOutlined />
                    </Popconfirm>
                </div>
            ),
            width: 80
        },
    ]

    const handleAdd = async () => {
        setDisplayForm(true)
    }

    const handleEdit = async (id: string) => {
        setObjectId(id)
        setDisplayForm(true)
    }

    const handleDelete = async (id: string) => {
        setLoading(true)
        const response = await DeleteBukuUkur(id)
        console.log(response)
        if (response.success) {
            message.success(`${page} dihapus!`)
            handleGetAll()
        }
        setLoading(false)
    }

    const handleCloseForm = async () => {
        setObjectId(null)
        setDisplayForm(false)
    }

    useEffect(() => {
        handleGetAll()
        setPage(page)
    }, [setPage]);

    return (
        <div className={style.buku_ukur}>
            {displayForm &&
                <FormBukuUkur
                    id={objectId}
                    open={displayForm}
                    close={handleCloseForm}
                    reload={handleGetAll}
                />
            }
            <PageHeader page={page} />
            <div className={style.main}>
                <div className={style.header + " mb-3"}>
                    <div className={style.search}>
                        <FIcon name='fi-rr-search' />
                    </div>

                    <Button
                        type='primary'
                        onClick={handleAdd}
                    >+ Add</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={objects}
                    loading={loading}
                    rowKey="id"
                />
            </div>
        </div>
    )
}

