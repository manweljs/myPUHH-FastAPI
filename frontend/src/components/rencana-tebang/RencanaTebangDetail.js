import React, { useEffect, useState } from 'react'
import style from "./rencana-tebang.module.css"
import { useParams } from 'react-router-dom'
import PageHeader from 'components/global/PageHeader'
import { GetTarget, GetRencanaTebang } from './RencanaTebangAPI'
import { SearchOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { Button, Popconfirm, Table } from 'antd'
import ModalUploadBarcodeRencanaTebang from './ModalUploadBarcode'
import { CustomPagination } from 'components/cruising/LHCDetail'

export default function RencanaTebangDetail() {

    const { id } = useParams()
    const [data, setData] = useState(null)
    const [DKB, setDKB] = useState([])
    const [loading, setLoading] = useState(true)
    const [displayForm, setDisplayForm] = useState(false)
    const [displayFormUpload, setDisplayFormUpload] = useState(false)
    const [count, setCount] = useState(0)


    const handleGetData = async () => {
        const response = await GetRencanaTebang(id)
        console.log(response)
        if (response.status) {
            setData(response.data)
        }
    }

    const handleGetTarget = async (page = 1) => {
        setLoading(true)
        const response = await GetTarget(id, page)
        console.log(response)
        setDKB(response.results)
        setCount(response.count)
        setLoading(false)
    }

    const handleCloseFormUpload = () => {
        setDisplayFormUpload(false)
    }

    const handleOpenFormUpload = () => {
        setDisplayFormUpload(true)
    }


    useEffect(() => {
        handleGetData()
        handleGetTarget()
    }, []);


    const columns = [
        {
            key: 'nomor',
            title: 'no. pohon',
            dataIndex: 'nomor',
            width: 100
        },
        {
            key: 'barcode',
            title: 'barcode',
            dataIndex: 'barcode',
            width: 260
        },
        {
            key: 'petak',
            title: 'petak',
            dataIndex: 'petak',
            width: 80
        },
        {
            key: 'jalur',
            title: 'jalur',
            dataIndex: 'jalur',
            width: 70
        },
        {
            key: 'panjang_jalur',
            title: 'panjang jalur',
            dataIndex: 'panjang_jalur',
            width: 120
        },
        {
            key: 'arah_jalur',
            title: 'arah jalur',
            dataIndex: 'arah_jalur',
            width: 100

        },
        {
            key: 'jenis',
            title: 'jenis',
            dataIndex: 'jenis',
        },
        {
            key: 'kelompok_jenis',
            title: 'kelompok jenis',
            dataIndex: 'kelompok_jenis',
        },
        {
            key: 'diameter',
            title: 'diameter',
            dataIndex: 'diameter',
            width: 100
        },
        {
            key: 'tinggi',
            title: 'tinggi',
            dataIndex: 'tinggi',
            width: 100

        },
        {
            key: 'volume',
            title: 'volume',
            dataIndex: 'volume',
            width: 100

        },
        {
            key: 'koordinat_x',
            title: 'koordinat x',
            dataIndex: 'koordinat_x',
        },
        {
            key: 'koordinat_y',
            title: 'koordinat y',
            dataIndex: 'koordinat_y',
        },
        {
            key: 'action',
            title: '',
            render: (record) => (
                <div className="action">
                    <EditOutlined onClick={() => handleEdit(record.id)} />
                    <Popconfirm
                        placement="bottomRight"
                        title={"Hapus LHC"}
                        description={`Apakah anda yakin menghapus LHC ini ?`}
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

    const handleEdit = (id) => {

    }

    const handleDelete = (id) => {

    }
    const handlePageChange = (page) => {
        console.log(page)
        handleGetTarget(page)
    }

    const tableHeight = window.innerHeight - 200

    const obyek = data?.obyek === 1 ? "Petak / Blok" : "Trase Jalan"
    const pageTitle = `Rencana Tebang - ${data?.nomor} (${obyek})`
    return (
        <div className={style.rencana_tebang_detail}>
            <PageHeader back={"/rencana-tebang"} page={pageTitle} size={"small"} />
            <div className={style.main}>
                <div className={style.header + " mb-2"}>
                    <div className={style.search}>
                        <SearchOutlined />
                    </div>
                    <Button
                        onClick={handleOpenFormUpload}
                        type="primary"
                        icon={<UploadOutlined />}>
                        Upload Barcode
                    </Button>
                </div>

                <Table
                    loading={loading}
                    size='small'
                    columns={columns}
                    dataSource={DKB}
                    pagination={false}
                    scroll={{
                        y: tableHeight
                    }}
                />
                <CustomPagination count={count} onChange={handlePageChange} />
            </div>

            <ModalUploadBarcodeRencanaTebang
                id={id}
                open={displayFormUpload}
                close={handleCloseFormUpload}
                reload={handleGetTarget}
            />
        </div>
    )
}
