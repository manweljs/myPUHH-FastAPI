import React, { useEffect, useState } from 'react'
import style from "./buku-ukur.module.css"
import PageHeader from 'components/global/PageHeader'
import { useUser } from 'UserContext'
import { SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { DeleteBukuUkur, GetAllBukuUkur } from './BukuUkurAPI'
import { Button, Popconfirm, Table, message } from 'antd'
import { Link } from 'react-router-dom'
import { FormBukuUkur } from 'components/forms/FormBukuUkur'
import dayjs from 'dayjs'
import { BukuUkurType } from 'types'

const page = "Buku Ukur"
document.title = page

export default function BukuUkur() {
    const { setPage } = useUser()
    const [objects, setObjects] = useState<BukuUkurType[]>([])
    const [objectId, setObjectId] = useState<string | null>(null)

    const [loading, setLoading] = useState(true)
    const [displayForm, setDisplayForm] = useState(false)

    const handleGetAll = async () => {
        setLoading(true)
        const response = await GetAllBukuUkur()
        // console.log(response)
        setObjects(response.data)
        setLoading(false)
    }

    const columns = [
        {
            key: 'nomor',
            title: 'nomor',
            dataIndex: 'nomor',
            render: (nomor:string, record:BukuUkurType) => <Link to={"/buku-ukur/" + record.id}>{nomor}</Link>

        },
        {
            key: 'obyek',
            title: 'obyek',
            dataIndex: 'obyek_name',
        },
        {
            key: 'tahun',
            title: 'Tahun RKT',
            dataIndex: 'tahun',
        },


        {
            key: 'tanggal',
            title: 'Tanggal',
            dataIndex: 'tanggal',
            render: (tanggal:string) => <span>{dayjs(tanggal).format("DD/MM/YYYY")}</span>
        },
        {
            key: 'action',
            title: '',
            render: (record:BukuUkurType) => (
                <div className="action">
                    <EditOutlined onClick={() => handleEdit(record.id)} />
                    <Popconfirm
                        placement="bottomRight"
                        title={`Hapus ${page}`}
                        description={`Apakah anda yakin menghapus ${page} ini ?`}
                        onConfirm={() => handleDelete(record.id)}
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

    const handleEdit = async (/** @type {any} */ id:string) => {
        setObjectId(id)
        setDisplayForm(true)
    }

    const handleDelete = async (/** @type {any} */ id:string) => {
        setLoading(true)
        const response = await DeleteBukuUkur(id)
        console.log(response)
        if (response?.status) { handleGetAll() }
        if (!response?.status) { message.error(response?.message) }
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
            <FormBukuUkur
                id={objectId}
                open={displayForm}
                close={handleCloseForm}
                reload={handleGetAll}
            />
            <PageHeader page={page} />
            <div className={style.main}>
                <div className={style.header + " mb-3"}>
                    <div className={style.search}>
                        <SearchOutlined />
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
                />
            </div>
        </div>
    )
}

