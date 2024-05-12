import { Button, Input, InputNumber, Popconfirm, Select, Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { TPnType } from '@/types'
import { DeleteTPn, GetAllTPn } from '@/api'
import { FormTPn } from '@/components/forms/FormTPn'

const page = "TPn"

export function ParameterTPn() {

    const [TPnId, setTPnId] = useState<string | null>(null)
    const [listTPn, setListTPn] = useState<TPnType[]>([])
    const [displayForm, setDisplayForm] = useState(false)
    const [loading, setLoading] = useState(true)

    const columns = [
        {
            key: 'nama',
            title: 'nama',
            dataIndex: 'nama',
        },
        {
            key: 'blok',
            title: 'Blok',
            render: (record: TPnType) => record.blok.nama
        },
        {
            key: 'action',
            title: '',
            render: (record: TPnType) => (
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
        setTPnId(null)
    }

    const handleAdd = () => {
        setDisplayForm(true)

    }

    const handleEdit = (id: string) => {
        setTPnId(id)
        setDisplayForm(true)
    }

    const handleDelete = async (id: string) => {
        const response = await DeleteTPn(id)
        console.log(response)
        if (response.success) {
            message.success(`${page} Dihapus!`)
            handleGetAll()
        }
    }

    const handleGetAll = async () => {
        setLoading(false)
        const response = await GetAllTPn()
        console.log(response)
        setListTPn(response)
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
                dataSource={listTPn}
                loading={loading}
                rowKey={"id"}
            />

            {displayForm &&
                <FormTPn
                    open={displayForm}
                    id={TPnId}
                    close={handleClose}
                    reload={handleGetAll}
                />
            }
        </div>
    )
}

const initial = {
    rkt: null,
    nama: "",
    luas: 0,

}

