import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { TahunKegiatanType } from '@/types'
import { CreateTahunKegiatan, GetTahunKegiatan, UpdateTahunKegiatan } from '@/api'
import { Button, Form, notification } from 'antd'
import FormModal from './FormModal'
import { Field } from './Field'

interface Props {
    id?: string | null,
    close: () => void,
    reload: () => void

}



const initialTahunKegiatan = {
    tahun: parseInt(dayjs().format("YYYY"), 10),
    tanggal_mulai: dayjs().format("YYYY-MM-DD"),
    tanggal_selesai: dayjs().format("YYYY-MM-DD"),
}


export const FormTahunKegiatan = (props: Props) => {

    const { id, close, reload } = props
    const [loading, setLoading] = useState(true)
    const [tahunKegiatan, setTahunKegiatan] = useState<TahunKegiatanType>(initialTahunKegiatan)
    const [api, contextHolder] = notification.useNotification()

    const handleGetTahunKegiatan = async () => {
        if (!id) return
        const response = await GetTahunKegiatan(id)
        console.log(response)
        response.status && setTahunKegiatan(response.data)
        setLoading(false)
    }

    const handleUpdate = ({ name, value }: any) => {
        setTahunKegiatan(prev => ({
            ...prev, [name]: value
        }))
    }

    const handleSave = async () => {
        setLoading(true)
        console.log('tahunKegiatan', tahunKegiatan)
        const response = id ? await UpdateTahunKegiatan(tahunKegiatan, id) : await CreateTahunKegiatan(tahunKegiatan)
        console.log(response)
        if (response.id) {
            api.success({
                message: 'Data berhasil disimpan'
            })
            reload()
            close()
        }

        setLoading(false)
    }

    useEffect(() => {
        if (id) {
            handleGetTahunKegiatan()
        } else {
            setLoading(false)
        }

    }, [id]);

    return (
        <>
            {contextHolder}
            <FormModal width={400} close={close} >
                <FormModal.Header>
                    <h3>TahunKegiatan</h3>
                    <div className="delete" onClick={close}></div>
                </FormModal.Header>

                <FormModal.Body >
                    <Form
                        layout='vertical'
                    >
                        <Field
                            type='number'
                            name='tahun'
                            label='Tahun'
                            value={tahunKegiatan.tahun}
                            onChange={(e) => handleUpdate({ name: 'tahun', value: e })}
                            required
                        />
                        <Field
                            type='date'
                            name='tanggal_mulai'
                            label='Tanggal Mulai'
                            value={tahunKegiatan.tanggal_mulai}
                        />
                        <Field
                            type='date'
                            name='tanggal_selesai'
                            label='Tanggal Selesai'
                            value={tahunKegiatan.tanggal_selesai}
                        />
                        <div className="group mt-5">
                            <Button onClick={handleSave} type='primary' >Save</Button>
                            <Button onClick={close} className='ml-2' >Cancel</Button>
                        </div>
                    </Form>

                </FormModal.Body>
            </FormModal>
        </>
    )
}



