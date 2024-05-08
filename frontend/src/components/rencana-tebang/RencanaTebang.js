import React, { useEffect, useState } from 'react';
import PageHeader from '../global/PageHeader';
import { Button, DatePicker, Input, InputNumber, Popconfirm, Radio, Select, Table, message } from 'antd';
import FormModal from '../global/FormModal';
import dayjs from 'dayjs';
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { GetAllRKT } from '../../api/SettingAPI';
import { useUser } from 'UserContext';
import { Link } from 'react-router-dom';
import style from "./rencana-tebang.module.css"
import { CreateRencanaTebang, DeleteRencanaTebang, GetAllRencanaTebang, GetRencanaTebang, UpdateRencanaTebang } from './RencanaTebangAPI';


const dateFormat = "YYYY-MM-DD";
const page = "Rencana Tebang"
document.title = page


export default function RencanaTebang() {
    const { setPage } = useUser()
    const [objects, setObjects] = useState([])
    const [objectId, setObjectId] = useState(null)

    const [loading, setLoading] = useState(true)
    const [displayForm, setDisplayForm] = useState(false)

    const handleGetAll = async () => {
        setLoading(true)
        const response = await GetAllRencanaTebang()
        console.log(response)
        setObjects(response.data)
        setLoading(false)
    }

    useEffect(() => {
        setPage(page);
        handleGetAll()
    }, [setPage]);


    const columns = [
        {
            key: 'nomor',
            title: 'nomor',
            dataIndex: 'nomor',
            render: (nomor, record) => <Link to={"/rencana-tebang/" + record.id}>{nomor}</Link>
        },
        {
            key: 'obyek',
            title: 'obyek',
            dataIndex: 'obyek',
            render: (obyek) => <span>{obyek === 1 ? "Petak / Blok" : "Trase Jalan"}</span>
        },
        {
            key: 'tanggal',
            title: 'tanggal',
            dataIndex: 'tanggal',
            render: (tanggal) => (
                tanggal &&
                <span>{dayjs(tanggal).format("DD MMM YYYY")}</span>
            )
        },
        {
            key: 'tahun',
            title: 'Tahun RKT',
            dataIndex: 'tahun',
        },
        {
            key: 'fe',
            title: 'Faktor Exploitasi',
            dataIndex: 'faktor',
        },
        {
            key: 'pohon',
            title: 'total pohon',
            dataIndex: 'pohon',
        },
        {
            key: 'volume',
            title: 'total volume (m3)',
            dataIndex: 'volume',
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
        const response = await DeleteRencanaTebang(id)
        console.log(response)
        response.status && handleGetAll()
    }

    return (
        <div className={style.rencana_tebang}>
            <PageHeader page={page} />
            <div className={style.main}>
                <div className={`${style.header} mb-3`}>
                    <div className="search">
                        <SearchOutlined />
                    </div>
                    <Button
                        type='primary'
                        onClick={handleAdd}
                    >+ Add</Button>
                </div>

                <Table
                    className='table-rkt'
                    columns={columns}
                    dataSource={objects}
                    loading={loading}
                />

                {displayForm &&
                    <FormRencanaTebang id={objectId} close={handleClose} reload={handleGetAll} />
                }
            </div>
        </div >
    )
}


const FormRencanaTebang = (props) => {
    const initial = {
        nomor: "",
        obyek: 1,
        rkt: null,
        faktor: "0.7",
        tanggal: dayjs().format(dateFormat),
    }
    const { id, close, reload } = props

    const [object, setObject] = useState(initial)
    const [loading, setLoading] = useState(false)


    const handleGet = async () => {
        const response = await GetRencanaTebang(id)
        console.log(response)
        response.status && setObject(response.data)
        setLoading(false)
    }

    const handleUpdate = ({ name, value }) => {
        console.log(name, value)
        setObject(prev => ({
            ...prev, [name]: value
        }))
    }

    const handleSave = async () => {
        setLoading(true)
        const data = JSON.stringify(object)
        const response = id ? await UpdateRencanaTebang(data, id) : await CreateRencanaTebang(data)
        console.log(response)
        if (response.status) {
            message.success(`${page} Disimpan!`)
            reload()
            close()
        }

        setLoading(false)
    }

    useEffect(() => {
        let cleanup
        if (id) {
            cleanup = handleGet()
        } else {
            cleanup = setLoading(false)
        }
        return cleanup
    }, []);

    const handleClose = () => {
        setObject(initial)
        close()
    }


    return (
        <FormModal width={400} close={handleClose} >
            <FormModal.Header>
                <h3>{page}</h3>
                <div className="delete" onClick={handleClose}></div>
            </FormModal.Header>
            <FormModal.Body >

                <FieldNomor data={object} handleUpdate={handleUpdate} />
                <FieldRKT data={object} handleUpdate={handleUpdate} />
                <FieldTanggal data={object} handleUpdate={handleUpdate} />
                <FieldObyek data={object} handleUpdate={handleUpdate} />
                <FieldFaktorExploitasi data={object} handleUpdate={handleUpdate} />
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

const FieldNomor = (props) => {
    const { data, handleUpdate } = props;
    console.log(data)
    return (
        <div className="field ">
            <div className="label">Nomor {page}</div>
            <Input
                value={data.nomor}
                onChange={(e) => handleUpdate({ name: "nomor", value: e.target.value })}
            />
        </div>
    )
}

const FieldFaktorExploitasi = (props) => {
    const { data, handleUpdate } = props;
    return (
        <div className="field ">
            <div className="label">Faktor Expliotasi</div>
            <InputNumber
                stringMode
                step={0.1}
                min={0}
                max={1}
                value={data.faktor}
                onChange={(e) => handleUpdate({ name: "faktor", value: e })}
            />
        </div>
    )
}

const FieldObyek = (props) => {
    const { data, handleUpdate } = props;
    return (
        <div className="field ">
            <div className="label">Obyek</div>
            <Radio.Group
                value={data.obyek}
                onChange={e => handleUpdate({ name: 'obyek', value: e.target.value })}
            >
                <Radio.Button value={1} >Petak / Blok</Radio.Button>
                <Radio.Button value={2} >Trase Jalan</Radio.Button>
            </Radio.Group>
        </div>
    )
}


const FieldRKT = (props) => {
    const { data, handleUpdate } = props;
    const [objects, setObjects] = useState([])
    const [loading, setLoading] = useState(true)
    const handleGetAll = async () => {
        const response = await GetAllRKT()
        console.log('response', response)
        setObjects(response.data)
        setLoading(false)
    }

    useEffect(() => {
        handleGetAll()
    }, [])
    return (
        <div className="field ">
            <div className="label">RKT</div>
            <Select
                value={data.rkt}
                onChange={(e) => handleUpdate({ name: "rkt", value: e })}
                loading={loading}
                className='w-100'
            >
                {
                    objects.map((item, index) => (
                        <Select.Option value={item.id} key={item.id} >
                            {item.tahun} {item.nomor}
                        </Select.Option>
                    ))
                }
            </Select>
        </div>
    )
}

const FieldTanggal = (props) => {
    const { data, handleUpdate } = props;
    return (
        <div className="field ">
            <div className="label">Tanggal</div>
            <DatePicker
                value={data.tanggal ? dayjs(data.tanggal) : ""}
                onChange={e => handleUpdate({ name: 'tanggal', value: dayjs(e).format(dateFormat) })}
                format={"DD-MM-YYYY"}
                allowClear={false}
            />

        </div>
    )
}



