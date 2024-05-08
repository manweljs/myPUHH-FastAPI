import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { GetBarcodeForTebangan, GetBukuUkur, GetDKBBukuUkur } from './BukuUkurAPI'
import { EditOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Table } from 'antd'
import style from "./buku-ukur.module.css"
import PageHeader from 'components/global/PageHeader'
import { useUser } from 'UserContext'
import { FormUploadDKBBukuUkur } from 'components/forms/FormUploadDKBBukuUkur'
import { CustomPagination } from 'components/cruising/LHCDetail'
import { BukuUkurType, KBType } from 'types'


const page = "Buku Ukur"

export default function DetailBukuUkur() {
    const { setPage } = useUser()
    const { id } = useParams()
    const [bukuUkur, setBukuUkur] = useState<BukuUkurType | null>(null)
    const [dkb, setDKB] = useState([])
    const [loading, setLoading] = useState(true)
    const [displayFormUpload, setDisplayFormUpload] = useState(false)
    const [count, setCount] = useState(0)

    const handleGetBukuUkur = async () => {
        if (!id) return
        setLoading(true)
        const response = await GetBukuUkur(id)
        console.log(response)
        response?.status && setBukuUkur(response.data)
    }

    const handleGetDKB = async (page = 1) => {
        if (!id) return
        setLoading(true)
        const response = await GetDKBBukuUkur(id, page)
        console.log(response)
        if (response?.results) {
            setDKB(response.results)
            setCount(response.count)
        }
        setLoading(false)
    }

    const columns = [
        {
            key: 'nomor',
            title: 'nomor',
            dataIndex: 'nomor',
            width: 65
        },
        {
            key: 'pot',
            title: 'pot',
            dataIndex: 'potongan',
            width: 40
        },
        {
            key: 'barcode',
            title: 'barcode',
            dataIndex: 'barcode_induk',
            width: 250
        },
        {
            key: 'petak',
            title: 'petak',
            dataIndex: 'petak',
            width: 80
        },
        {
            key: 'pohon',
            title: 'pohon',
            dataIndex: 'pohon',
            width: 80
        },
        {
            key: 'jenis',
            title: 'jenis',
            dataIndex: 'nama_jenis',
        },
        {
            key: 'kelompok_jenis',
            title: 'kelompok jenis',
            dataIndex: 'kelompok_jenis',
        },
        {
            key: 'panjang',
            title: 'panjang',
            dataIndex: 'panjang',
            width: 100,
            render: (panjang: number) => <span className='is-number'> {panjang.toFixed(2)} </span>

        },
        {
            key: 'diameter',
            title: 'diameter',
            dataIndex: 'diameter',
            width: 100,
            render: (diameter: number) => <span className='is-number'> {diameter} </span>

        },

        {
            key: 'volume',
            title: 'volume',
            dataIndex: 'volume',
            width: 80,
            render: (volume: number) => <span className='is-number'> {volume.toFixed(2)} </span>
        },
        {
            key: 'keterangan',
            title: 'keterangan',
            dataIndex: 'keterangan',
            width: 125,
        },
        {
            key: 'sortimen',
            title: 'sortimen',
            dataIndex: 'sortimen',
            width: 100,
        },
        {
            key: 'action',
            title: '',
            render: (record: KBType) => (
                <div className="action">
                    <EditOutlined onClick={() => handleEdit(record.id)} />
                    <Popconfirm
                        placement="bottomRight"
                        title={"Hapus Baris"}
                        description={`Apakah anda yakin menghapus Baris ini ?`}
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

    const handleEdit = async (id: string) => {

    }

    const handleDelete = async (id: string) => {

    }

    const handleCloseForm = () => {
        setDisplayFormUpload(false)
    }

    useEffect(() => {
        handleGetBukuUkur()
        handleGetDKB()
        setPage(page)
    }, []);

    const handlePageChange = (/** @type {number} */ page: number) => {
        handleGetDKB(page)
    }

    const handleCariBarcode = async () => {
        if (!id) return
        setLoading(true)
        const response = await GetBarcodeForTebangan(id)
        console.log(response)
        setLoading(false)
    }

    const tableHeight = window.innerHeight - 200
    const pageTitle = `${page} - ${bukuUkur?.nomor} (${bukuUkur?.obyek_name})`
    return (
        <div className={style.detail_buku_ukur}>
            {id &&
                <FormUploadDKBBukuUkur
                    id={id}
                    open={displayFormUpload}
                    close={handleCloseForm}
                    reload={handleGetDKB}
                />
            }

            <PageHeader
                back={"/buku-ukur"}
                page={pageTitle}
                size={"small"} />

            <div className={style.main}>

                <div className={style.header + " mb-2"}>
                    <div className={style.search}>
                        <SearchOutlined />
                    </div>
                    <div className={style.group}>
                        <Button
                            onClick={handleCariBarcode}
                            className='mr-2'
                        >Cari Barcode</Button>

                        <Button type="primary"
                            onClick={() => setDisplayFormUpload(true)}
                            icon={<UploadOutlined />}
                        >Upload</Button>
                    </div>
                </div>
                <Table
                    size='small'
                    scroll={{ y: tableHeight }}
                    loading={loading}
                    columns={columns}
                    dataSource={dkb}
                    pagination={false}
                />
                {dkb.length > 0 &&
                    <CustomPagination count={count} onChange={handlePageChange} />
                }
            </div>

        </div>
    )
}
