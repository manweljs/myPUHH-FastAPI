import React, { useEffect, useState } from 'react'
import { Button, Form, Input, message, Modal, Radio } from 'antd'
import { TPKInType } from '@/types'
import { CreateTPK, GetTPK, UpdateTPK } from '@/api';
import { Field } from './Field';

const initial: TPKInType = {
    nama: "",
    kategori: 0,
    alamat: "",

}

interface Props {
    id?: string | null;
    close: () => void;
    reload: () => void;
    open: boolean;
}


export const FormTPK = (props: Props) => {

    const { id, close, reload, open } = props
    const [loading, setLoading] = useState(true)
    const [tpk, setTPK] = useState<TPKInType | null>(null)
    const [form] = Form.useForm()

    const handleGet = async () => {
        if (!id) return
        const response = await GetTPK(id)
        console.log(response)
        if (response.id || response.success) {

            setTPK(response)
            form.setFieldsValue(response);
        }
        setLoading(false)
    }

    const handleUpdate = (e: any) => {
        setTPK((prev: any) => ({
            ...prev, ...e
        }))
    }

    const handleSave = async () => {
        if (!tpk) return
        setLoading(true)

        const response = id ? await UpdateTPK(tpk, id) : await CreateTPK(tpk)
        console.log(response)
        if (response.success || response.id) {
            message.success(`TPK Disimpan!`)
            form.setFieldsValue(initial)
            reload()
            close()
        }

        setLoading(false)
    }

    useEffect(() => {
        form.resetFields()
        if (id) {
            handleGet()
        } else {
            setTPK(initial)
            form.setFieldsValue(initial);
            setLoading(false)
        }
    }, [id, form]);

    console.log('tpk', tpk)

    return (
        <Modal
            width={400}
            open={open}
            title="TPK"
            onCancel={close}
            footer={null}
        >
            {tpk &&
                <Form
                    onValuesChange={handleUpdate}
                    layout='vertical'
                    initialValues={tpk}
                    form={form}
                >
                    <Field
                        type='char'
                        name='nama'
                        label='Nama'
                        value={tpk?.nama}
                        required
                    />

                    <Field
                        type='select'
                        name='kategori'
                        label='Kategori'
                        value={tpk?.kategori}
                        options={[
                            { value: 0, label: "TPK Hutan" },
                            { value: 1, label: "TPK Antara" }
                        ]}
                        required
                    />

                    <Field
                        type='char'
                        name='alamat'
                        label='Alamat'
                        value={tpk?.alamat}
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


