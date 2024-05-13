import React, { useEffect, useState } from 'react'
import { Button, Form, message, Modal, } from 'antd'
import { BukuUkurInType } from '@/types'
import { CreateBukuUkur, GetBukuUkur, UpdateBukuUkur } from '@/api';
import { Field } from './Field';
import dayjs from 'dayjs'
import { FieldTahunKegiatan } from './fields/FieldTahunKegiatan';

const defaultDate = dayjs().format("YYYY-MM-DD")
const pageTitle = "Buku Ukur"

const initial: BukuUkurInType = {
    id: undefined,
    nomor: "",
    tahun_id: undefined,
    tanggal: dayjs().toString(),

}

interface Props {
    id?: string | null;
    close: () => void;
    reload: () => void;
    open?: boolean;
}


export const FormBukuUkur = (props: Props) => {

    const { id, close, reload, open } = props
    const [loading, setLoading] = useState(true)
    const [bukuUkur, setBukuUkur] = useState<BukuUkurInType | null>(null)

    const handleGet = async () => {
        if (!id) return
        const response = await GetBukuUkur(id)
        console.log(response)
        if (response.id || response.success) {
            setBukuUkur({
                ...response,
                tahun_id: response.tahun.id
            })

        }
        setLoading(false)
    }

    const handleUpdate = (e: any) => {
        setBukuUkur((prev: any) => ({
            ...prev, ...e
        }))
    }

    const handleSave = async () => {
        if (!bukuUkur) return
        setLoading(true)
        const { tanggal } = bukuUkur
        const data = {
            ...bukuUkur,
            tanggal: tanggal ? dayjs(tanggal).format("YYYY-MM-DD") : defaultDate,
        }
        console.log(pageTitle + 'untuk save', data)


        const response = id ? await UpdateBukuUkur(data, id) : await CreateBukuUkur(data)
        console.log(response)
        if (response.success || response.id) {
            message.success(`${pageTitle} Disimpan!`)
            reload()
            setBukuUkur(null)
            close()
        }

        setLoading(false)
    }

    useEffect(() => {
        if (id) {
            handleGet()
            return
        } else {
            setBukuUkur(initial)
            setLoading(false)
        }
        return () => {
            setBukuUkur(null)
        }
    }, [id]);

    return (
        <Modal
            width={400}
            open={open}
            title={pageTitle}
            onCancel={close}
            footer={null}
        >
            {bukuUkur &&
                <Form
                    onValuesChange={handleUpdate}
                    layout='vertical'
                >
                    <Field
                        type='char'
                        name='nomor'
                        label='Nomor'
                        value={bukuUkur.nomor}
                        required
                    />

                    <FieldTahunKegiatan
                        value={bukuUkur.tahun_id}
                        required
                    />

                    <Field
                        type='date'
                        name='tanggal'
                        label='Tanggal'
                        value={bukuUkur.tanggal}
                    />

                    <div className="group mt-5">
                        <Button
                            onClick={handleSave}
                            type='primary'
                            loading={loading}
                        >Save</Button>
                        <Button onClick={close} className='ml-2' >Cancel</Button>
                    </div>
                </Form>
            }
        </Modal>
    )
}


