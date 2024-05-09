"use client";
import React, { useEffect } from 'react'
import { PageHeader } from '@/components/global'
import styles from "./lhp.module.sass"
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { Popconfirm } from 'antd'
import { useUserContext } from '@/hooks/UserContext'
import { LHPType } from '@/types'
import { PAGE } from '@/consts';

const page = PAGE.LHP.TITLE;

export function LHP() {
    const { setPage } = useUserContext()

    useEffect(() => {
        setPage(page)

    }, []);



    const handleEdit = async (id: string) => {

    }

    const handleDelete = async (id: string) => {

    }

    const columns = [
        {
            key: 'nomor',
            title: 'nomor',
            dataIndex: 'nomor',
        },
        {
            key: 'tahun',
            title: 'Tahun RKT',
            dataIndex: 'tahun',
        },
        {
            key: 'rkt',
            title: 'Nomor RKT',
            dataIndex: 'nomor_rkt',
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
            <div className="main">
                <PageHeader page={page} />
            </div>

        </div>
    )
}
