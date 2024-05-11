import { Button, Input, InputNumber, Popconfirm, Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import FormModal from '../forms/FormModal'
import dayjs from 'dayjs'
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { TahunKegiatanType } from '@/types'
import { DeleteTahunKegiatan, GetAllTahunKegiatan } from '@/api'
import { FormTahunKegiatan } from '../forms/FormTahunKegiatan'

export function ParameterTahunKegiatan() {

    const [tahunKegiatanId, setTahunKegiatanId] = useState<string | null>(null)
    const [listTahunKegiatan, setListTahunKegiatan] = useState<TahunKegiatanType[]>([])
    const [displayForm, setDisplayForm] = useState(false)
    const [loading, setLoading] = useState(true)

    const columns = [
        {
            key: 'tahun',
            title: 'Tahun',
            dataIndex: 'tahun',
        },

        {
            key: 'luas',
            title: 'luas (ha)',
            dataIndex: 'luas',
        },
        {
            key: 'action',
            title: '',
            render: (record: TahunKegiatanType) => (
                <div className="action">
                    <EditOutlined onClick={() => record.id && handleEdit(record.id)} />
                    <Popconfirm
                        placement="bottomRight"
                        title={"Hapus RKT"}
                        description={"Apakah anda yakin menghapus RKT ini ?"}
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
        setTahunKegiatanId(null)
    }

    const handleAdd = () => {
        setDisplayForm(true)

    }

    const handleEdit = (id: string) => {
        setTahunKegiatanId(id)
        setDisplayForm(true)
    }

    const handleDelete = async (id: string) => {
        const response = await DeleteTahunKegiatan(id)
        console.log(response)
        response.status && handleGetAllRKT()
    }

    const handleGetAllRKT = async () => {
        setLoading(false)
        const response = await GetAllTahunKegiatan()
        console.log(response)
        setListTahunKegiatan(response)
        setLoading(false)
    }

    useEffect(() => {
        handleGetAllRKT()
    }, []);

    return (
        <div className="setting-rkt">
            <div className="header mb-3">
                <h3>Tahun Kegiatan</h3>
                <Button
                    type='primary'
                    onClick={handleAdd}
                >+ Add</Button>
            </div>


            <Table
                className='table-rkt'
                columns={columns}
                dataSource={listTahunKegiatan}
                loading={loading}
            />

            {displayForm &&
                <FormTahunKegiatan
                    id={tahunKegiatanId}
                    close={handleClose}
                    reload={handleGetAllRKT}
                />
            }
        </div>
    )
}

