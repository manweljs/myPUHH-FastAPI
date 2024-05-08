import { Button, Input, InputNumber, Popconfirm, Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { CreateRKT, DeleteRKT, GetAllRKT, GetRKT, UpdateRKT } from '../../api/SettingAPI'
import FormModal from '../global/FormModal'
import dayjs from 'dayjs'
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"

export default function SettingRKT() {

    const [RKTId, setRKTId] = useState(null)
    const [RKTs, setRKTs] = useState([])
    const [displayForm, setDisplayForm] = useState(false)
    const [loading, setLoading] = useState(true)

    const columns = [
        {
            key: 'tahun',
            title: 'Tahun',
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
                        title={"Hapus RKT"}
                        description={"Apakah anda yakin menghapus RKT ini ?"}
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
        setRKTId(null)
    }

    const handleAdd = () => {
        setDisplayForm(true)

    }

    const handleEdit = (id) => {
        setRKTId(id)
        setDisplayForm(true)
    }

    const handleDelete = async (id) => {
        const response = await DeleteRKT(id)
        console.log(response)
        response.status && handleGetAllRKT()
    }

    const handleGetAllRKT = async () => {
        setLoading(false)
        const response = await GetAllRKT()
        console.log(response)
        setRKTs(response.data)
        setLoading(false)
    }

    useEffect(() => {
        handleGetAllRKT()
    }, []);

    return (
        <div className="setting-rkt">

            {

            }
            <div className="header mb-3">
                <h3>RKT</h3>
                <Button
                    type='primary'
                    onClick={handleAdd}
                >+ Add</Button>
            </div>


            <Table
                className='table-rkt'
                columns={columns}
                dataSource={RKTs}
                loading={loading}
            />

            {displayForm &&
                <FormRKT id={RKTId} close={handleClose} reload={handleGetAllRKT} />
            }
        </div>
    )
}



const initialRKT = {
    tahun: dayjs().format("YYYY"),
    luas: 0,
    nomor: "",

}

const FormRKT = (props) => {

    const { id, close, reload } = props
    const [loading, setLoading] = useState(true)
    const [RKT, setRKT] = useState(initialRKT)

    const handleGetRKT = async () => {
        const response = await GetRKT(id)
        console.log(response)
        response.status && setRKT(response.data)
        setLoading(false)
    }

    const handleUpdate = ({ name, value }) => {
        setRKT(prev => ({
            ...prev, [name]: value
        }))
    }

    const handleSave = async () => {
        setLoading(true)
        const data = JSON.stringify(RKT)
        const response = id ? await UpdateRKT(data, id) : await CreateRKT(data)
        console.log(response)
        if (response.status) {
            message.success("RKT Disimpan!")
            reload()
            close()
        }

        setLoading(false)
    }

    useEffect(() => {
        if (id) {
            handleGetRKT()
        } else {
            setLoading(false)
        }

    }, [id]);

    return (
        <FormModal width={400} close={close} >
            <FormModal.Header>
                <h3>RKT</h3>
                <div className="delete" onClick={close}></div>
            </FormModal.Header>

            <FormModal.Body >
                <FieldTahun data={RKT} handleUpdate={handleUpdate} />

                <FieldLuas data={RKT} handleUpdate={handleUpdate} />

                <div className="group mt-5">
                    <Button onClick={handleSave} type='primary' >Save</Button>
                    <Button onClick={close} className='ml-2' >Cancel</Button>
                </div>
            </FormModal.Body>
        </FormModal>
    )
}



const FieldNomor = (props) => {
    const { data, handleUpdate } = props;
    return (
        <div className="field ">
            <div className="label">Nomor RKT</div>
            <Input
                value={data.nomor}
                onChange={e => handleUpdate({ name: 'nomor', value: e.target.value })}
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

const FieldTahun = (props) => {
    const { data, handleUpdate } = props;
    return (
        <div className="field">
            <div className="label">Tahun</div>
            <InputNumber
                className='w-100'
                value={data.tahun}
                onChange={e => handleUpdate({ name: 'tahun', value: e })}
            />
        </div>
    )
}

