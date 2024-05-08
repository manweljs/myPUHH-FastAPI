import { Button, Input, InputNumber, Popconfirm, Select, Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { CreatePetak, DeletePetak, GetAllBlok, GetAllPetak, GetPetak, UpdatePetak } from '../../api/SettingAPI'
import FormModal from '../global/FormModal'
import { EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons"
import { FormUploadCSV } from 'components/forms/FormUploadCSV'

const page = "Petak"

export default function SettingPetak() {

    const [objectId, setObjectId] = useState(null)
    const [objects, setObjects] = useState([])
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
            dataIndex: 'nama_blok',
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
                        title={"Hapus Petak"}
                        description={"Apakah anda yakin menghapus Petak ini ?"}
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
        const response = await DeletePetak(id)
        console.log(response)
        response.status && handleGetAll()
    }

    const handleGetAll = async () => {
        setLoading(false)
        const response = await GetAllPetak()
        console.log(response)
        setObjects(response.data)
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
            />

            {displayForm &&
                <FormPetak id={objectId} close={handleClose} reload={handleGetAll} />
            }
        </div>
    )
}

const initial = {
    rkt: null,
    nama: "",
    luas: 0,

}

const FormPetak = (props) => {

    const { id, close, reload } = props
    const [loading, setLoading] = useState(true)
    const [object, setObject] = useState(initial)

    const handleGet = async () => {
        const response = await GetPetak(id)
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
        const response = id ? await UpdatePetak(data, id) : await CreatePetak(data)
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
                <FieldBlok data={object} handleUpdate={handleUpdate} />
                <FieldNama data={object} handleUpdate={handleUpdate} />
                <FieldLuas data={object} handleUpdate={handleUpdate} />

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

const FieldBlok = (props) => {
    const { data, handleUpdate } = props;
    const [objects, setObjects] = useState([])
    const [loading, setLoading] = useState(true)

    const handleGetAll = async () => {
        setLoading(true)
        const response = await GetAllBlok()
        console.log(response)
        response.status && setObjects(response.data)
        setLoading(false)
    }

    useEffect(() => {
        handleGetAll()
    }, []);
    return (
        <div className="field">
            <div className="label">Blok</div>
            <Select
                className='w-100'
                value={data.blok}
                loading={loading}
                onChange={e => handleUpdate({ name: 'blok', value: e })}
            >

                {
                    objects.map((item, index) => (
                        <Select.Option value={item.id}>
                            {item.nama}
                        </Select.Option>
                    ))
                }
            </Select>
        </div>
    )
}

