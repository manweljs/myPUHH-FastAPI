import { Button, Popconfirm, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons"
import { BlokType, PetakType } from '@/types'
import { FormUploadCSV } from '@/components/forms/FormUploadCSV'
import { DeletePetak, GetAllPetak } from '@/api'
import { FormPetak } from '@/components/forms/FormPetak'

const page = "Petak"

export default function ParameterPetak() {

    const [objectId, setObjectId] = useState<string | null>(null)
    const [objects, setObjects] = useState<PetakType[]>([])
    const [displayForm, setDisplayForm] = useState(false)
    const [displayFormUpload, setDisplayFormUpload] = useState(false)

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
            render: (record: PetakType) => (record.blok.nama)
        },
        {
            key: 'luas',
            title: 'luas (Ha)',
            dataIndex: 'luas',
        },
        {
            key: 'action',
            title: '',
            render: (record: PetakType) => (
                <div className="action">
                    <EditOutlined onClick={() => record.id && handleEdit(record.id)} />
                    <Popconfirm
                        placement="bottomRight"
                        title={"Hapus Petak"}
                        description={"Apakah anda yakin menghapus Petak ini ?"}
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
        setObjectId(null)
    }

    const handleAdd = () => {
        setDisplayForm(true)

    }

    const handleEdit = (id: string) => {
        setObjectId(id)
        setDisplayForm(true)
    }

    const handleDelete = async (id: string) => {
        const response = await DeletePetak(id)
        console.log(response)
        response.status && handleGetAll()
    }

    const handleGetAll = async () => {
        setLoading(false)
        const response = await GetAllPetak()
        console.log(response)
        setObjects(response)
        setLoading(false)
    }


    useEffect(() => {
        handleGetAll()
    }, []);

    const handleCloseFormUpload = async () => {
        setDisplayFormUpload(false)
        setLoading(false)

    }


    return (
        <div className={`setting-${page}`}>
            <FormUploadCSV
                url='api/conf/UploadPetak'
                open={displayFormUpload}
                close={handleCloseFormUpload}
                reload={handleGetAll}
                title='Upload Petak'
            />
            <div className="header mb-3">
                <h3>{page}</h3>
                <div className="group">
                    <Button
                        onClick={() => setDisplayFormUpload(true)}
                        icon={<UploadOutlined />}
                        className='mr-2'
                    >Upload</Button>
                    <Button
                        type='primary'
                        onClick={handleAdd}
                    >+ Add</Button>
                </div>
            </div>


            <Table
                className={`table-${page}`}
                columns={columns}
                dataSource={objects}
                loading={loading}
                rowKey={"id"}
            />

            {displayForm &&
                <FormPetak
                    id={objectId}
                    close={handleClose}
                    reload={handleGetAll}
                />
            }
        </div>
    )
}

