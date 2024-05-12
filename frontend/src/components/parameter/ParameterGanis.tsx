import { Button, Popconfirm, Table } from 'antd'
import React, { useEffect, useState } from 'react'

import dayjs from 'dayjs'
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { GanisType } from '@/types'
import { FormGanis } from '../forms/FormGanis'
import { DeleteGanis, GetAllGanis } from '@/api'
import { FORMAT } from '@/consts'

const page = "Ganis"

export function ParameterGanis() {

    const [ganisId, setGanisId] = useState<string | null>(null)
    const [listGanis, setListGanis] = useState<GanisType[]>([])
    const [displayForm, setDisplayForm] = useState(false)
    const [loading, setLoading] = useState(true)

    const columns = [
        {
            key: 'nama',
            title: 'nama',
            dataIndex: 'nama',
        },
        {
            key: 'jabatan',
            title: 'jabatan',
            render: (record: GanisType) => record.jabatan.nama
        },
        {
            key: 'berlaku_dari',
            title: 'berlaku dari',
            dataIndex: 'berlaku_dari',
            render: (date: string) => (dayjs(date).format(FORMAT.DATE))
        },
        {
            key: 'berlaku_sampai',
            title: 'berlaku sampai',
            dataIndex: 'berlaku_sampai',
            render: (date: string) => (dayjs(date).format(FORMAT.DATE))

        },
        {
            key: 'action',
            title: '',
            render: (record: GanisType) => (
                <div className="action">
                    <EditOutlined onClick={() => record.id && handleEdit(record.id)} />
                    <Popconfirm
                        placement="bottomRight"
                        title={`Hapus ${page}`}
                        description={`Apakah anda yakin menghapus ${page} ini ?`}
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
        setGanisId(null)
    }

    const handleAdd = () => {
        setDisplayForm(true)

    }

    const handleEdit = (id: string) => {
        setGanisId(id)
        setDisplayForm(true)
    }

    const handleDelete = async (id: string) => {
        const response = await DeleteGanis(id)
        console.log(response)
        response.status && handleGetAll()
    }

    const handleGetAll = async () => {
        setLoading(false)
        const response = await GetAllGanis()
        console.log(response)
        setListGanis(response)
        setLoading(false)
    }

    useEffect(() => {
        handleGetAll()
    }, []);

    return (
        <div className={`setting-${page}`}>
            <div className="header mb-3">
                <h3>{page}</h3>
                <Button
                    type='primary'
                    onClick={handleAdd}
                >+ Add</Button>
            </div>


            <Table
                className={`table-${page}`}
                columns={columns}
                dataSource={listGanis}
                loading={loading}
                rowKey={"id"}
            />

            {displayForm &&
                <FormGanis
                    id={ganisId}
                    open={displayForm}
                    close={handleClose}
                    reload={handleGetAll}
                />
            }
        </div>
    )
}

