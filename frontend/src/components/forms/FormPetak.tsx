import React, { useEffect, useState } from 'react'
import FormModal from './FormModal';
import { PetakInType } from '@/types';
import { CreatePetak, GetPetak, UpdatePetak } from '@/api';
import { Button, Form, message } from 'antd';
import { Field } from './Field';
import { FieldBlok } from './fields/FieldBlok';

interface Props {
    id?: string | null;
    close: () => void;
    reload: () => void;
}


const initial = {
    blok_id: null,
    nama: "",
    luas: 0,
}

export const FormPetak = (props: Props) => {

    const { id, close, reload } = props
    const [loading, setLoading] = useState(true)
    const [petak, setPetak] = useState<PetakInType | null>(null)

    const handleGet = async () => {
        if (!id) return
        const response = await GetPetak(id)
        console.log(response)
        if (response.id) {
            setPetak({
                ...response,
                blok_id: response.blok.id
            })
        }
        setLoading(false)
    }

    const handleUpdate = (e: any) => {
        setPetak((prev: any) => ({
            ...prev, ...e
        }))
    }

    const handleSave = async () => {
        if (!petak) return
        setLoading(true)
        console.log('petak data', petak)
        const response = id ? await UpdatePetak(petak, id) : await CreatePetak(petak)
        console.log(response)
        if (response.success || response.id) {
            message.success(`Petak Disimpan!`)
            reload()
            close()
        }

        setLoading(false)
    }

    console.log('petak', petak)

    useEffect(() => {
        if (id) {
            handleGet()
        } else {
            setPetak(initial)
            setLoading(false)
        }

    }, [id]);

    return (
        <FormModal width={400} close={close} >
            <FormModal.Header>
                <h3>Petak</h3>
                <div className="delete" onClick={close}></div>
            </FormModal.Header>

            <FormModal.Body >
                {petak &&
                    <Form
                        layout='vertical'
                        onValuesChange={handleUpdate}

                    >
                        <Field
                            type='char'
                            name='nama'
                            label='Nama'
                            value={petak.nama}
                            required
                        />

                        <FieldBlok required value={petak.blok_id} handleUpdate={handleUpdate} />


                        <Field
                            type='number'
                            name='luas'
                            label='Luas (Ha)'
                            value={petak.luas}
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


