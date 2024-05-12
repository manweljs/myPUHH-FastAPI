import React, { useEffect, useState } from 'react'
import { Button, Form, message, Modal, Space, } from 'antd'
import { GanisInType } from '@/types'
import { CreateGanis, GetGanis, UpdateGanis } from '@/api';
import { Field } from './Field';
import { FieldJabatanGanis } from './fields/FieldJabatanGanis';
import dayjs from 'dayjs'
import { FORMAT } from '@/consts';

const initial: GanisInType = {
    id: null,
    nama: "",
    jabatan_id: null,
    berlaku_dari: dayjs().toString(),
    berlaku_sampai: dayjs().toString(),

}

interface Props {
    id?: string | null;
    close: () => void;
    reload: () => void;
    open: boolean;
}


export const FormGanis = (props: Props) => {

    const { id, close, reload, open } = props
    const [loading, setLoading] = useState(true)
    const [ganis, setGanis] = useState<GanisInType | null>(null)
    const [form] = Form.useForm()

    const handleGet = async () => {
        if (!id) return
        const response = await GetGanis(id)
        console.log(response)
        if (response.id || response.success) {

            setGanis({
                ...response,
                jabatan_id: response.jabatan.id
            })

        }
        setLoading(false)
    }

    const handleUpdate = (e: any) => {
        setGanis((prev: any) => ({
            ...prev, ...e
        }))
    }

    const handleSave = async () => {
        if (!ganis) return
        setLoading(true)
        console.log('ganis untuk save', ganis)
        const { berlaku_dari, berlaku_sampai } = ganis
        const data = {
            ...ganis,
            berlaku_dari: berlaku_dari ? dayjs(berlaku_dari).format("YYYY-MM-DD") : null,
            berlaku_sampai: berlaku_sampai ? dayjs(berlaku_sampai).format("YYYY-MM-DD") : null,
        }
        const response = id ? await UpdateGanis(data, id) : await CreateGanis(data)
        console.log(response)
        if (response.success || response.id) {
            message.success(`Ganis Disimpan!`)
            form.resetFields()
            reload()
            close()
        }

        setLoading(false)
    }

    useEffect(() => {
        if (id) {
            handleGet()
            return
        } else {
            setGanis(initial)
            form.setFieldsValue(initial);
            setLoading(false)
        }
    }, [id, form]);

    return (
        <Modal
            width={400}
            open={open}
            title="Ganis"
            onCancel={close}
            footer={null}
        >
            {ganis &&
                <Form
                    onValuesChange={handleUpdate}
                    layout='vertical'
                >
                    <Field
                        type='char'
                        name='nama'
                        label='Nama'
                        value={ganis.nama}
                        required
                    />

                    <FieldJabatanGanis
                        value={ganis.jabatan_id}
                        required
                    />

                    <Space>

                        <Field
                            type='date'
                            name='berlaku_dari'
                            label='Berlaku Dari'
                            value={ganis.berlaku_dari}
                        />

                        <Field
                            type='date'
                            name='berlaku_sampai'
                            label='Berlaku Sampai'
                            value={ganis.berlaku_sampai}
                        />
                    </Space>


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


