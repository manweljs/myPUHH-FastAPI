import React, { useEffect } from 'react'
import Navbar from '../navbar/Navbar'
import PageHeader from '../global/PageHeader'
import { useUser } from '../../UserContext'
import style from "./lhp.module.sass"
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { Popconfirm } from 'antd'

const page = "LHP"
document.title = page

export default function LHP() {
    const { setPage } = useUser()

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
            render: (record) => (
                <div className="action">
                    <EditOutlined onClick={() => handleEdit(record.id)} />
                    <Popconfirm
                        placement="bottomRight"
                        title={"Hapus Blok"}
                        description={"Apakah anda yakin menghapus LHP ini ?"}
                        onConfirm={() => handleDelete(record.id)}
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

    const handleEdit = async () => {

    }

    const handleDelete = async () => {

    }

    useEffect(() => {
        setPage(page)

    }, []);

    return (
        <div className='lhp'>
            <div className="main">
                <PageHeader page={page} />
            </div>

        </div>
    )
}
