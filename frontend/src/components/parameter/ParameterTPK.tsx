import { Button, Popconfirm, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { TPKType } from '@/types'
import { DeleteTPK, GetAllTPK } from '@/api'
import { FormTPK } from '@/components/forms/FormTPK'

const page = "TPK"

export function ParameterTPK() {

    const [TPKId, setTPKId] = useState<string | null>(null)
    const [listTPK, setListTPK] = useState<TPKType[]>([])
    const [displayForm, setDisplayForm] = useState(false)
    const [loading, setLoading] = useState(true)

    const columns = [
        {
            key: 'nama',
            title: 'nama',
            dataIndex: 'nama',
        },
        {
            key: 'kategori',
            title: 'kategori',
            dataIndex: 'kategori',
            render: (kategori: number) => (
                <span>{kategori === 0 ? "TPK Hutan" : "TPK Antara"}</span>
            )
        },
        {
            key: 'alamat',
            title: 'Alamat',
            dataIndex: 'alamat',
        },
        {
            key: 'action',
            title: '',
            render: (record: TPKType) => (
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
        setTPKId(null)
    }

    const handleAdd = () => {
        setDisplayForm(true)

    }

    const handleEdit = (id: string) => {
        setTPKId(id)
        setDisplayForm(true)
    }

    const handleDelete = async (id: string) => {
        const response = await DeleteTPK(id)
        console.log(response)
        if (response.success) {
            handleGetAll()
        }
    }

    const handleGetAll = async () => {
        setLoading(false)
        const response = await GetAllTPK()
        console.log(response)
        setListTPK(response)
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
                dataSource={listTPK}
                loading={loading}
            />

            {displayForm &&
                <FormTPK
                    open={displayForm}
                    id={TPKId}
                    close={handleClose}
                    reload={handleGetAll}
                />
            }
        </div>
    )
}



