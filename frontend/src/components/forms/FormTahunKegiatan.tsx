import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { TahunKegiatanType } from '@/types'
import { CreateTahunKegiatan, GetTahunKegiatan, UpdateTahunKegiatan } from '@/api'
import { Button, Form, notification, message, Spin, DatePicker } from 'antd'
import FormModal from './FormModal'
import { Field } from './Field'
import { FORMAT } from '@/consts'

interface Props {
    id?: string | null,
    close: () => void,
    reload: () => void

}



const initialTahunKegiatan = {
    tahun: parseInt(dayjs().format("YYYY"), 10),
    tanggal_mulai: dayjs().format(FORMAT.DATE),
    tanggal_selesai: dayjs().format(FORMAT.DATE),
}


export const FormTahunKegiatan = (props: Props) => {

    const { id, close, reload } = props
    const [loading, setLoading] = useState(true)
    const [tahunKegiatan, setTahunKegiatan] = useState<TahunKegiatanType | null>(null)
    const [api, contextHolder] = notification.useNotification()

    const handleGetTahunKegiatan = async () => {
        if (!id) return
        setLoading(true)
        const response = await GetTahunKegiatan(id)
        console.log(response)
        if (response.id) {
            setTahunKegiatan(response)
        }
        setLoading(false)
    }

    const handleUpdate = (e: any) => {
        setTahunKegiatan((prev: any) => ({
            ...prev, ...e
        }))
    }

    const handleSave = async () => {
        if (!tahunKegiatan) return
        setLoading(true)

        console.log('tahunKegiatan', tahunKegiatan)
        const { tahun, tanggal_mulai, tanggal_selesai } = tahunKegiatan
        const data = {
            tahun,
            tanggal_mulai: tanggal_mulai ? dayjs(tanggal_mulai).format("YYYY-MM-DD") : null,
            tanggal_selesai: tanggal_selesai ? dayjs(tanggal_selesai).format("YYYY-MM-DD") : null,
        }
        const response = id ? await UpdateTahunKegiatan(data, id) : await CreateTahunKegiatan(data)
        console.log(response)
        if (response.success) {
            message.success('Data berhasil disimpan')
            reload()
            close()
        }

        setLoading(false)
    }

    useEffect(() => {
        if (id) {
            handleGetTahunKegiatan()
        } else {
            setTahunKegiatan(initialTahunKegiatan)
            setLoading(false)
        }

    }, [id]);

    console.log('tahunKegiatan', tahunKegiatan)
    return (
        <>
            {contextHolder}
            <FormModal width={400} close={close} >
                <FormModal.Header>
                    <h3>TahunKegiatan</h3>
                    <div className="delete" onClick={close}></div>
                </FormModal.Header>
                {tahunKegiatan ?
                    <FormModal.Body >
                        <Form
                            layout='vertical'
                            onValuesChange={handleUpdate}
                        >
                            <Field
                                type='number'
                                name='tahun'
                                label='Tahun'
                                value={tahunKegiatan.tahun}
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
                    : <Spin />
                }
            </FormModal>
        </>
    )
}



