import { Button, Input, InputNumber, Popconfirm, Radio, Select, Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { CreateAlatAngkut, CreateGanis, CreateTPK, CreateTPn, DeleteAlatAngkut, DeleteGanis, DeleteTPK, DeleteTPn, GetAlatAngkut, GetAllAlatAngkut, GetAllBlok, GetAllGanis, GetAllJabatanGanis, GetAllJenisAlatAngkut, GetAllTPK, GetAllTPn, GetGanis, GetTPK, GetTPn, UpdateAlatAngkut, UpdateGanis, UpdateTPK, UpdateTPn } from '../../api/SettingAPI'
import FormModal from '../global/FormModal'
import dayjs from 'dayjs'
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"

const page = "Alat Angkut"

export default function SettingAlatAngkut() {

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
            key: 'jenis',
            title: 'Jenis',
            dataIndex: 'nama_jenis',
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
        const response = await DeleteAlatAngkut(id)
        console.log(response)
        response.status && handleGetAll()
    }

    const handleGetAll = async () => {
        setLoading(false)
        const response = await GetAllAlatAngkut()
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
                <FormAlatAngkut id={objectId} close={handleClose} reload={handleGetAll} />
            }
        </div>
    )
}

const initial = {
    nama: "",
    jenis: "747be6c0-9bb3-4b7d-b082-ae38766fb2f7",

}

const FormAlatAngkut = (props) => {

    const { id, close, reload } = props
    const [loading, setLoading] = useState(true)
    const [object, setObject] = useState(initial)

    const handleGet = async () => {
        const response = await GetAlatAngkut(id)
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
        const response = id ? await UpdateAlatAngkut(data, id) : await CreateAlatAngkut(data)
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
                <FieldJenis data={object} handleUpdate={handleUpdate} />
                <FieldNama data={object} handleUpdate={handleUpdate} />

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

const FieldJenis = (props) => {
    const { data, handleUpdate } = props;
    const [objects, setObjects] = useState([])
    const [loading, setLoading] = useState(true)

    const handleGetAll = async () => {
        const response = await GetAllJenisAlatAngkut()
        console.log('response', response)
        setObjects(response.data)
        setLoading(false)
    }

    useEffect(() => {
        handleGetAll()
    }, [])
    return (
        <div className="field ">
            <div className="label">Jenis</div>
            <Radio.Group
                value={data.jenis}
                onChange={(e) => handleUpdate({ name: "jenis", value: e.target.value })}
                loading={loading}
                className='w-100'
            >
                {
                    objects.map((item, index) => (
                        <Radio.Button value={item.id} >
                            {item.nama}
                        </Radio.Button>
                    ))
                }
            </Radio.Group>
        </div>
    )
}



