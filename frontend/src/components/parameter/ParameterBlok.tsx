import { Button, Input, InputNumber, Popconfirm, Select, Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import FormModal from '../forms/FormModal'
import dayjs from 'dayjs'
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { BlokType } from '@/types'
import { DeleteBlok, GetAllBlok } from '@/api'
import { FormBlok } from '../forms/FormBlok'

export function ParameterBlok() {

    const [blokId, setBlokId] = useState<string | null>(null)
    const [bloks, setBloks] = useState<BlokType[]>([])
    const [displayForm, setDisplayForm] = useState(false)
    const [loading, setLoading] = useState(true)

    const columns = [
        {
            key: 'nama',
            title: 'nama',
            dataIndex: 'nama',
        },
        {
            key: 'tahun',
            title: 'Tahun Kegiatan',
            render: (record: BlokType) => (record.tahun.tahun)
        },

        {
            key: 'action',
            title: '',
            render: (record: BlokType) => (
                <div className="action">
                    <EditOutlined onClick={() => record.id && handleEdit(record.id)} />
                    <Popconfirm
                        placement="bottomRight"
                        title={"Hapus Blok"}
                        description={"Apakah anda yakin menghapus Blok ini ?"}
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
        setBlokId(null)
    }

    const handleAdd = () => {
        setDisplayForm(true)

    }

    const handleEdit = (id: string) => {
        setBlokId(id)
        setDisplayForm(true)
    }

    const handleDelete = async (id: string) => {
        const response = await DeleteBlok(id)
        console.log(response)
        if (response.success) {
            message.success("Blok Dihapus!")
            handleGetAllBlok()
        }
    }

    const handleGetAllBlok = async () => {
        setLoading(false)
        const response = await GetAllBlok()
        console.log(response)
        setBloks(response)
        setLoading(false)
    }

    useEffect(() => {
        handleGetAllBlok()
    }, []);

    return (
        <div className="setting-blok">
            <div className="header mb-3">
                <h3>Blok</h3>
                <Button
                    type='primary'
                    onClick={handleAdd}
                >+ Add</Button>
            </div>


            <Table
                className='table-rkt'
                columns={columns}
                dataSource={bloks}
                loading={loading}
                rowKey={"id"}
            />

            {displayForm &&
                <FormBlok id={blokId} close={handleClose} reload={handleGetAllBlok} />
            }
        </div>
    )
}

