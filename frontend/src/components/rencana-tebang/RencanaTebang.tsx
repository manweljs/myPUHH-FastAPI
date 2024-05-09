"use client";
import React, { useEffect, useState } from 'react';
import { PageHeader } from '../global/PageHeader';
import { Button, DatePicker, Input, InputNumber, Popconfirm, Radio, Select, Table, message } from 'antd';
import FormModal from '../global/FormModal';
import dayjs from 'dayjs';
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import styles from "./rencana-tebang.module.sass"
import { useUserContext } from '@/hooks/UserContext';
import { CreateRencanaTebang, DeleteRencanaTebang, GetAllRencanaTebang, GetAllTahunKegiatan, GetRencanaTebang, UpdateRencanaTebang } from '@/api';
import { RencanaTebangType, TahunKegiatanType } from '@/types';
import Link from 'next/link';
import { FORMAT, PAGE } from '@/consts';

const dateFormat = FORMAT.DATE;
const page = PAGE.RENCANA_TEBANG.TITLE;
document.title = page


export default function RencanaTebang() {
    const { setPage } = useUserContext()
    const [objects, setObjects] = useState<RencanaTebangType[]>([])
    const [objectId, setObjectId] = useState<string | null>(null)

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
    }, []);


    const columns = [
        {
            key: 'nomor',
            title: 'nomor',
            dataIndex: 'nomor',
            render: (nomor: string, record: RencanaTebangType) => <Link href={"/rencana-tebang/" + record.id}>{nomor}</Link>
        },
        {
            key: 'obyek',
            title: 'obyek',
            dataIndex: 'obyek',
            render: (obyek: number) => <span>{obyek === 1 ? "Petak / Blok" : "Trase Jalan"}</span>
        },
        {
            key: 'tanggal',
            title: 'tanggal',
            dataIndex: 'tanggal',
            render: (tanggal: string) => (
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
            render: (record: RencanaTebangType) => (
                <div className="action">
                    <EditOutlined onClick={() => record.id && handleEdit(record.id)} />
                    <Popconfirm
                        placement="bottomRight"
                        title={"Hapus LHC"}
                        description={`Apakah anda yakin menghapus LHC ini ?`}
                        onConfirm={() => record.id && handleDelete(record.id)}
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

    const handleEdit = (id: string) => {
        if (!id) return
        setObjectId(id)
        setDisplayForm(true)
    }

    const handleDelete = async (id: string) => {
        const response = await DeleteRencanaTebang(id)
        console.log(response)
        response.status && handleGetAll()
    }

    return (
        <div className={styles.rencana_tebang}>
            <PageHeader page={page} />
            <div className={styles.main}>
                <div className={`${styles.header} mb-3`}>
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


const FormRencanaTebang = (props: {
    id: string | null,
    close: () => void,
    reload: () => void

}) => {
    const initial: RencanaTebangType = {
        nomor: "",
        obyek: 1,
        tahun_id: null,
        faktor: 0.7,
        tanggal: dayjs().format(dateFormat),
    }
    const { id, close, reload } = props

    const [rencanaTebang, setRencanaTebang] = useState(initial)
    const [loading, setLoading] = useState(false)


    const handleGetRencanaTebang = async () => {
        if (!id) return
        setLoading(true)
        const response = await GetRencanaTebang(id)
        console.log(response)
        response.status && setRencanaTebang(response.data)
        setLoading(false)
    }

    const handleUpdate = ({ name, value }: any) => {
        console.log(name, value)
        setRencanaTebang(prev => ({
            ...prev, [name]: value
        }))
    }

    const handleSave = async () => {
        setLoading(true)
        const response = id ? await UpdateRencanaTebang(rencanaTebang, id) : await CreateRencanaTebang(rencanaTebang)
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
            handleGetRencanaTebang()
        }
        return () => {
            setRencanaTebang(initial)
        }
    }, [id]);

    const handleClose = () => {
        close()
    }


    return (
        <FormModal width={400} close={handleClose} >
            <FormModal.Header>
                <h3>{page}</h3>
                <div className="delete" onClick={handleClose}></div>
            </FormModal.Header>
            <FormModal.Body >

                <FieldNomor data={rencanaTebang} handleUpdate={handleUpdate} />
                <FieldTahunKegiatan data={rencanaTebang} handleUpdate={handleUpdate} />
                <FieldTanggal data={rencanaTebang} handleUpdate={handleUpdate} />
                <FieldObyek data={rencanaTebang} handleUpdate={handleUpdate} />
                <FieldFaktorExploitasi data={rencanaTebang} handleUpdate={handleUpdate} />
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

interface FieldProps {
    data: RencanaTebangType,
    handleUpdate: (data: any) => void
}

const FieldNomor = (props: FieldProps) => {
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

const FieldFaktorExploitasi = (props: FieldProps) => {
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

const FieldObyek = (props: FieldProps) => {
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


const FieldTahunKegiatan = (props: FieldProps) => {
    const { data, handleUpdate } = props;
    const [objects, setObjects] = useState([])
    const [loading, setLoading] = useState(true)
    const handleGetAll = async () => {
        const response = await GetAllTahunKegiatan()
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
                value={data.tahun_id}
                onChange={(e) => handleUpdate({ name: "rkt", value: e })}
                loading={loading}
                className='w-100'
            >
                {
                    objects.map((item: TahunKegiatanType, index) => (
                        <Select.Option value={item.id} key={index} >
                            {item.tahun}
                        </Select.Option>
                    ))
                }
            </Select>
        </div>
    )
}

const FieldTanggal = (props: FieldProps) => {
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



