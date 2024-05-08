import { Button, Input, InputNumber, Popconfirm, Radio, Select, Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { CreateTPK, CreateTPn, DeleteTPK, DeleteTPn, GetAllBlok, GetAllKabupaten, GetAllTPK, GetAllTPn, GetPerusahaan, GetTPK, GetTPn, UpdatePerusahaan, UpdateTPK, UpdateTPn } from '../../api/SettingAPI'
import FormModal from '../global/FormModal'
import dayjs from 'dayjs'
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import AntdFileUpload from '../global/AntdFileUpload'


const page = "Perusahaan"

export default function SettingPerusahaan() {

    const [perusahaan, setPerusahaan] = useState([])
    const [displayForm, setDisplayForm] = useState(false)
    const [loading, setLoading] = useState(true)

    const handleClose = () => {
        setDisplayForm(false)
        handleGet()
    }

    const handleEdit = (id) => {
        setDisplayForm(true)
    }

    const handleGet = async () => {
        setLoading(false)
        const response = await GetPerusahaan()
        console.log(response)
        setPerusahaan(response.data)
        setLoading(false)
    }

    useEffect(() => {
        handleGet()
    }, []);

    return (
        <div className={`setting-${page}`}>
            <div className="header mb-3">
                <h3>{page}</h3>
            </div>
            {
                !displayForm &&
                <div className="detail-perusahaan mb-6">
                    <div className="name-box">
                        <img src={perusahaan.logo} alt="" className="logo" />
                        <div className="group">
                            <h2>{perusahaan.nama}</h2>
                            <p>{perusahaan.alamat},
                                <span> {perusahaan.nama_kabupaten}, </span>
                                <span> {perusahaan.nama_propinsi}</span>

                            </p>
                            {perusahaan.telepon &&
                                <p> Telepon : {perusahaan.telepon}</p>
                            }

                        </div>

                    </div>
                </div>
            }

            {displayForm && perusahaan ?
                <FormPerusahaan perusahaan={perusahaan} setPerusahaan={setPerusahaan} close={handleClose} />
                :
                <Button
                    type='primary'
                    onClick={handleEdit}
                >Edit</Button>
            }
        </div>
    )
}

const FormPerusahaan = (props) => {
    const { perusahaan, setPerusahaan, close } = props
    const [loading, setLoading] = useState(false)

    const handleUpdate = ({ name, value }) => {
        setPerusahaan(prev => ({
            ...prev, [name]: value
        }))
    }

    const handleSave = async () => {
        setLoading(true)
        const data = JSON.stringify(perusahaan)
        const response = await UpdatePerusahaan(data)
        console.log(response)
        if (response.status) {
            message.success(`${page} Disimpan!`)
            close()
        }

        setLoading(false)
    }

    return (
        <div className="form">
            <FieldNama data={perusahaan} handleUpdate={handleUpdate} />
            <FieldAlamat data={perusahaan} handleUpdate={handleUpdate} />
            <FieldKabupaten data={perusahaan} handleUpdate={handleUpdate} />
            <FieldTelepon data={perusahaan} handleUpdate={handleUpdate} />
            <FieldLogo data={perusahaan} handleUpdate={handleUpdate} />
            <div className="group mt-5">
                <Button
                    onClick={handleSave}
                    type='primary'
                    loading={loading}
                >Save</Button>
                <Button onClick={close} className='ml-2' >Cancel</Button>
            </div>
        </div>
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
                        <Select.Option value={item.id} key={item.id} >
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
                rows={2}
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
const FieldLogo = (props) => {
    const { data, handleUpdate } = props;
    const [file, setFile] = useState(null)


    const handleChange = (e) => {
        console.log(e)
        setFile(e.file)
    }

    console.log(data)

    useEffect(() => {
        if (data.logo) {
            setFile({
                uid: "logo-1",
                url: data.logo,
            })
        }
    }, []);
    return (
        <div className="field ">
            <div className="label">Logo</div>
            <AntdFileUpload
                maxCount={1}
                callback={handleChange}
                filekey="file"
                endpoint="api/Upload/?type=logo"
                file={file}
            />
            <div className="tip">Upload logo perusahaan, logo akan ditampilkan pada laporan-laporan.</div>
            <div className="tip">Rekomendasi ukuran 200px * 200px dalam format .png transparan background.</div>

        </div>
    )
}
