import { Button, Input, InputNumber, Popconfirm, Radio, Select, Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { CreatePerusahaanPembeli, CreateTPK, CreateTPn, DeletePerusahaanPembeli, DeleteTPK, DeleteTPn, GetAllBlok, GetAllKabupaten, GetAllPerusahaanPembeli, GetAllTPK, GetAllTPn, GetPerusahaanPembeli, GetTPK, GetTPn, UpdatePerusahaanPembeli, UpdateTPK, UpdateTPn } from '../../api/SettingAPI'
import FormModal from '../global/FormModal'
import dayjs from 'dayjs'
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"

const page = "Perusahaan Pembeli"

export default function SettingPerusahaanPembeli() {

    const [objectId, setObjectId] = useState(null)
    const [objects, setObjects] = useState([])
    const [displayForm, setDisplayForm] = useState(false)
    const [loading, setLoading] = useState(true)

    const columns = [
        {
            key: 'nama',
            title: 'nama',
            dataIndex: 'nama',
        },
        {
            key: 'kabupaten',
            title: 'kabupaten',
            dataIndex: 'nama_kabupaten',
        },
        {
            key: 'propinsi',
            title: 'propinsi',
            dataIndex: 'nama_propinsi',
        },
        {
            key: 'alamat',
            title: 'alamat',
            dataIndex: 'alamat',
        },
        {
            key: 'telepon',
            title: 'telepon',
            dataIndex: 'telepon',
        },
        {
            key: 'action',
            title: '',
            render: (record) => (
                <div className="action">
                    <EditOutlined onClick={() => handleEdit(record.id)} />
                    <Popconfirm
                        placement="bottomRight"
                        title={`Hapus ${page}`}
                        description={`Apakah anda yakin menghapus ${page} ini ?`}
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
        setObjectId(null)
    }

    const handleAdd = () => {
        setDisplayForm(true)

    }

    const handleEdit = (id) => {
        setObjectId(id)
        setDisplayForm(true)
    }

    const handleDelete = async (id) => {
        const response = await DeletePerusahaanPembeli(id)
        console.log(response)
        response.status && handleGetAll()
    }

    const handleGetAll = async () => {
        setLoading(false)
        const response = await GetAllPerusahaanPembeli()
        console.log(response)
        setObjects(response.data)
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
                dataSource={objects}
                loading={loading}
            />

            {displayForm &&
                <FormPerusahaanPembeli id={objectId} close={handleClose} reload={handleGetAll} />
            }
        </div>
    )
}

const initial = {
    nama: "",
    jenis_tpk: 0,
    koordinat: "",

}

const FormPerusahaanPembeli = (props) => {

    const { id, close, reload } = props
    const [loading, setLoading] = useState(true)
    const [object, setObject] = useState(initial)

    const handleGet = async () => {
        const response = await GetPerusahaanPembeli(id)
        console.log(response)
        response.status && setObject(response.data)
        setLoading(false)
    }

    const handleUpdate = ({ name, value }) => {
        setObject(prev => ({
            ...prev, [name]: value
        }))
    }

    const handleSave = async () => {
        setLoading(true)
        const data = JSON.stringify(object)
        const response = id ? await UpdatePerusahaanPembeli(data, id) : await CreatePerusahaanPembeli(data)
        console.log(response)
        if (response.status) {
            message.success(`${page} Disimpan!`)
            reload()
            close()
        }

        setLoading(false)
    }

    useEffect(() => {
        if (id) {
            handleGet()
        } else {
            setLoading(false)
        }

    }, [id]);

    return (
        <FormModal width={400} close={close} >
            <FormModal.Header>
                <h3>{page}</h3>
                <div className="delete" onClick={close}></div>
            </FormModal.Header>

            <FormModal.Body >
                <FieldNama data={object} handleUpdate={handleUpdate} />
                <FieldAlamat data={object} handleUpdate={handleUpdate} />
                <FieldKabupaten data={object} handleUpdate={handleUpdate} />
                <FieldTelepon data={object} handleUpdate={handleUpdate} />

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
            <div className="label">Nama {page}</div>
            <Input
                value={data.nama}
                onChange={e => handleUpdate({ name: 'nama', value: e.target.value })}
            />
        </div>
    )
}

const FieldKabupaten = (props) => {
    const { data, handleUpdate } = props;
    const [objects, setObjects] = useState([])
    const [loading, setLoading] = useState(true)
    const handleGetAll = async () => {
        const response = await GetAllKabupaten()
        console.log('response', response)
        setObjects(response.data)
        setLoading(false)
    }

    useEffect(() => {
        handleGetAll()
    }, [])
    return (
        <div className="field ">
            <div className="label">Kabupaten / Kota</div>
            <Select
                value={data.kabupaten}
                onChange={(e) => handleUpdate({ name: "kabupaten", value: e })}
                loading={loading}
                className='w-100'
                showSearch
                filterOption={(inputValue, option) =>
                    option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                }  // Filter options based on input search value

            >
                {
                    objects.map((item, index) => (
                        <Select.Option value={item.id} >
                            {item.nama}
                        </Select.Option>
                    ))
                }
            </Select>
        </div>
    )
}

const FieldAlamat = (props) => {
    const { data, handleUpdate } = props;
    return (
        <div className="field ">
            <div className="label">Alamat</div>
            <Input.TextArea
                value={data.alamat}
                maxLength={255}
                rows={3}
                onChange={e => handleUpdate({ name: 'alamat', value: e.target.value })}
            />
        </div>
    )
}


const FieldTelepon = (props) => {
    const { data, handleUpdate } = props;
    return (
        <div className="field ">
            <div className="label">Telepon</div>
            <Input
                value={data.telepon}
                onChange={e => handleUpdate({ name: 'telepon', value: e.target.value })}
            />
        </div>
    )
}

