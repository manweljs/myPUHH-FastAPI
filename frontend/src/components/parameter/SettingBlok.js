import { Button, Input, InputNumber, Popconfirm, Select, Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { CreateBlok, CreateRKT, DeleteBlok, DeleteRKT, GetAllBlok, GetAllRKT, GetBlok, GetRKT, UpdateBlok } from '../../api/SettingAPI'
import FormModal from '../global/FormModal'
import dayjs from 'dayjs'
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"

export default function SettingBlok() {

    const [blokId, setBlokId] = useState(null)
    const [bloks, setBloks] = useState([])
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
            title: 'Tahun RKT',
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
            render: (record) => (
                <div className="action">
                    <EditOutlined onClick={() => handleEdit(record.id)} />
                    <Popconfirm
                        placement="bottomRight"
                        title={"Hapus Blok"}
                        description={"Apakah anda yakin menghapus Blok ini ?"}
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

    const handleClose = () => {
        setDisplayForm(false)
        setBlokId(null)
    }

    const handleAdd = () => {
        setDisplayForm(true)

    }

    const handleEdit = (id) => {
        setBlokId(id)
        setDisplayForm(true)
    }

    const handleDelete = async (id) => {
        const response = await DeleteBlok(id)
        console.log(response)
        response.status && handleGetAllBlok()
    }

    const handleGetAllBlok = async () => {
        setLoading(false)
        const response = await GetAllBlok()
        console.log(response)
        setBloks(response.data)
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
            />

            {displayForm &&
                <FormBlok id={blokId} close={handleClose} reload={handleGetAllBlok} />
            }
        </div>
    )
}

const initial = {
    rkt: null,
    nama: "",
    luas: 0,

}

const FormBlok = (props) => {

    const { id, close, reload } = props
    const [loading, setLoading] = useState(true)
    const [blok, setBlok] = useState(initial)

    const handleGetBlok = async () => {
        const response = await GetBlok(id)
        console.log(response)
        response.status && setBlok(response.data)
        setLoading(false)
    }

    const handleUpdate = ({ name, value }) => {
        setBlok(prev => ({
            ...prev, [name]: value
        }))
    }

    const handleSave = async () => {
        setLoading(true)
        const data = JSON.stringify(blok)
        const response = id ? await UpdateBlok(data, id) : await CreateBlok(data)
        console.log(response)
        if (response.status) {
            message.success("Blok Disimpan!")
            reload()
            close()
        }

        setLoading(false)
    }

    useEffect(() => {
        if (id) {
            handleGetBlok()
        } else {
            setLoading(false)
        }

    }, [id]);

    return (
        <FormModal width={400} close={close} >
            <FormModal.Header>
                <h3>Blok</h3>
                <div className="delete" onClick={close}></div>
            </FormModal.Header>

            <FormModal.Body >
                <FieldRKT data={blok} handleUpdate={handleUpdate} />
                <FieldNama data={blok} handleUpdate={handleUpdate} />
                <FieldLuas data={blok} handleUpdate={handleUpdate} />

                <div className="group mt-5">
                    <Button
                        onClick={handleSave}
                        type='primary'
                        loading={loading}
                    >Save</Button>
                    <Button onClick={close} className='ml-2' >Cancel</Button>
                </div>
            </FormModal.Body>
        </FormModal>
    )
}

const FieldNama = (props) => {
    const { data, handleUpdate } = props;
    return (
        <div className="field ">
            <div className="label">Nama Blok</div>
            <Input
                value={data.nama}
                onChange={e => handleUpdate({ name: 'nama', value: e.target.value })}
            />
        </div>
    )
}

const FieldLuas = (props) => {
    const { data, handleUpdate } = props;
    return (
        <div className="field ">
            <div className="label">Luas (ha)</div>
            <InputNumber
                // className='w-100'
                value={data.luas}
                onChange={e => handleUpdate({ name: 'luas', value: e })}
            />
        </div>
    )
}

const FieldRKT = (props) => {
    const { data, handleUpdate } = props;
    const [RKTs, setRKTs] = useState([])
    const [loading, setLoading] = useState(true)

    const handleGetAllRKT = async () => {
        setLoading(true)
        const response = await GetAllRKT()
        console.log(response)
        response.status && setRKTs(response.data)
        setLoading(false)
    }

    useEffect(() => {
        handleGetAllRKT()
    }, []);
    return (
        <div className="field">
            <div className="label">RKT</div>
            <Select
                className='w-100'
                value={data.rkt}
                loading={loading}
                onChange={e => handleUpdate({ name: 'rkt', value: e })}
            >

                {
                    RKTs.map((item, index) => (
                        <Select.Option value={item.id}>
                            {item.tahun} {item.nomor}
                        </Select.Option>
                    ))
                }
            </Select>
        </div>
    )
}

