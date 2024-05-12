import React, { useEffect, useState } from 'react'
import { Button, Form, message, Modal, } from 'antd'
import { TPnInType } from '@/types'
import { CreateTPn, GetTPn, UpdateTPn } from '@/api';
import { Field } from './Field';
import { FieldBlok } from './fields/FieldBlok';

const initial: TPnInType = {
    id: null,
    nama: "",
    blok_id: null,

}

interface Props {
    id?: string | null;
    close: () => void;
    reload: () => void;
    open: boolean;
}


export const FormTPn = (props: Props) => {

    const { id, close, reload, open } = props
    const [loading, setLoading] = useState(true)
    const [tpn, setTPn] = useState<TPnInType | null>(null)
    const [form] = Form.useForm()

    const handleGet = async () => {
        if (!id) return
        const response = await GetTPn(id)
        console.log(response)
        if (response.id || response.success) {

            setTPn({
                ...response,
                blok_id: response.blok.id
            })
            form.setFieldsValue(response);
        }
        setLoading(false)
    }

    const handleUpdate = (e: any) => {
        setTPn((prev: any) => ({
            ...prev, ...e
        }))
    }

    const handleSave = async () => {
        if (!tpn) return
        setLoading(true)
        console.log('tpn untuk save', tpn)
        const response = id ? await UpdateTPn(tpn, id) : await CreateTPn(tpn)
        console.log(response)
        if (response.success || response.id) {
            message.success(`TPn Disimpan!`)
            form.resetFields()
            reload()
            close()
        }

        setLoading(false)
    }

    useEffect(() => {
        if (id) {
            handleGet()
        } else {
            setTPn(initial)
            form.setFieldsValue(initial);
            setLoading(false)
        }
    }, [id, form]);

    return (
        <Modal
            width={400}
            open={open}
            title="TPn"
            onCancel={close}
            footer={null}
        >
            {tpn &&
                <Form
                    onValuesChange={handleUpdate}
                    layout='vertical'
                    initialValues={tpn}
                    form={form}
                >
                    <Field
                        type='char'
                        name='nama'
                        label='Nama'
                        value={tpn.nama}
                        required
                    />

                    <FieldBlok
                        name='blok_id'
                        value={tpn.blok_id}
                        required
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


