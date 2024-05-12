
import { CreateBlok, GetBlok, UpdateBlok } from '@/api';
import { BlokInType } from '@/types';
import { Button, Form, message } from 'antd';
import React, { useEffect, useState } from 'react'
import FormModal from './FormModal';
import { FieldTahunKegiatan } from './fields/FieldTahunKegiatan';
import { Field } from './Field';

interface Props {
    id?: string | null;
    close: () => void;
    reload: () => void;

}

const initial: BlokInType = {
    tahun_id: undefined,
    nama: "",

}


export const FormBlok = (props: Props) => {

    const { id, close, reload } = props
    const [loading, setLoading] = useState(true)
    const [blok, setBlok] = useState<BlokInType | null>(null)

    const handleGetBlok = async () => {
        if (!id) return
        setLoading(true)
        const response = await GetBlok(id)
        console.log(response)
        if (response.id) {
            setBlok({
                ...response,
                tahun_id: response.tahun.id,
            })
        }
        setLoading(false)
    }

    const handleUpdate = (e: any) => {
        setBlok((prev: any) => ({
            ...prev, ...e
        }))
    }

    const handleSave = async () => {
        if (!blok) return
        setLoading(true)
        const response = id ? await UpdateBlok(blok, id) : await CreateBlok(blok)
        console.log(response)
        if (response.id || response.success) {
            message.success(response.message || "Blok Disimpan!")
            reload()
            close()
        }

        setLoading(false)
    }

    useEffect(() => {
        if (id) {
            handleGetBlok()
        } else {
            setBlok(initial)
            setLoading(false)
        }

    }, [id]);

    console.log('blok', blok)

    return (
        <FormModal width={400} close={close} >
            <FormModal.Header>
                <h3>Blok</h3>
                <div className="delete" onClick={close}></div>
            </FormModal.Header>

            <FormModal.Body >
                {blok &&
                    <Form
                        onValuesChange={handleUpdate}
                        layout='vertical'
                    >
                        <FieldTahunKegiatan
                            name="tahun_id"
                            value={blok?.tahun_id}
                            handleUpdate={handleUpdate}
                            required
                        />

                        <Field
                            type="char"
                            name="nama"
                            label='Nama Blok'
                            value={blok?.nama}
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
            </FormModal.Body>
        </FormModal>
    )
}



