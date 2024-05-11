import { Button, Input, InputNumber, Popconfirm, Radio, Select, Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { CreateTPK, CreateTPn, DeleteTPK, DeleteTPn, GetAllBlok, GetAllTPK, GetAllTPn, GetTPK, GetTPn, UpdateTPK, UpdateTPn } from '../../api/SettingAPI'
import FormModal from '../forms/FormModal'
import dayjs from 'dayjs'
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"

const page = "TPK"

export default function SettingTPK() {

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
            key: 'type',
            title: 'type',
            dataIndex: 'jenis_tpk',
            render: (jenis_tpk) => (
                <span>{jenis_tpk === 0 ? "TPK Hutan" : "TPK Antara"}</span>
            )
        },
        {
            key: 'koordinat',
            title: 'koordinat',
            dataIndex: 'koordinat',
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
        const response = await DeleteTPK(id)
        console.log(response)
        response.status && handleGetAll()
    }

    const handleGetAll = async () => {
        setLoading(false)
        const response = await GetAllTPK()
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
                <FormTPK id={objectId} close={handleClose} reload={handleGetAll} />
            }
        </div>
    )
}

const initial = {
    nama: "",
    jenis_tpk: 0,
    koordinat: "",

}

const FormTPK = (props) => {

    const { id, close, reload } = props
    const [loading, setLoading] = useState(true)
    const [object, setObject] = useState(initial)

    const handleGet = async () => {
        const response = await GetTPK(id)
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
        const response = id ? await UpdateTPK(data, id) : await CreateTPK(data)
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
                <FieldJenisTPK data={object} handleUpdate={handleUpdate} />
                <FieldKoordinat data={object} handleUpdate={handleUpdate} />

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

const FieldJenisTPK = (props) => {
    const { data, handleUpdate } = props;
    return (
        <div className="field ">
            <div className="label">Type</div>
            <Radio.Group
                value={data.jenis_tpk}
                onChange={(e) => handleUpdate({ name: "jenis_tpk", value: e.target.value })}
            >
                <Radio.Button value={0} >TPK Hutan</Radio.Button>
                <Radio.Button value={1} >TPK Antara</Radio.Button>
            </Radio.Group>
        </div>
    )
}

const FieldKoordinat = (props) => {
    const { data, handleUpdate } = props;
    return (
        <div className="field ">
            <div className="label">Koordinat
                <span className='optional'> (optional)</span></div>
            <Input
                value={data.koordinat}
                onChange={e => handleUpdate({ name: 'koordinat', value: e.target.value })}
            />
        </div>
    )
}

