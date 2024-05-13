import React, { useEffect, useState } from 'react'
import { Button, Form, message, Modal, } from 'antd'
import { LHPInType } from '@/types'
import { CreateLHP, GetBukuUkur, GetLHP, UpdateLHP } from '@/api';
import { Field } from './Field';
import dayjs from 'dayjs'
import { FieldTahunKegiatan } from './fields/FieldTahunKegiatan';
import { OBYEK } from '@/consts';

const defaultDate = dayjs().format("YYYY-MM-DD")
const pageTitle = "LHP"

const initial: LHPInType = {
    id: undefined,
    nomor: "",
    tahun_id: undefined,
    tanggal: dayjs().toString(),
    obyek: OBYEK.BLOK_PETAK

}

interface Props {
    id?: string | null;
    close: () => void;
    reload: () => void;
    open?: boolean;
}


export const FormLHP = (props: Props) => {

    const { id, close, reload, open } = props
    const [loading, setLoading] = useState(true)
    const [lhp, setLHP] = useState<LHPInType | null>(null)

    const handleGet = async () => {
        if (!id) return
        const response = await GetLHP(id)
        console.log(response)
        if (response.id || response.success) {
            setLHP({
                ...response,
                tahun_id: response.tahun.id
            })

        }
        setLoading(false)
    }

    const handleUpdate = (e: any) => {
        setLHP((prev: any) => ({
            ...prev, ...e
        }))
    }

    const handleSave = async () => {
        if (!lhp) return
        setLoading(true)
        const { tanggal } = lhp
        const data = {
            ...lhp,
            tanggal: tanggal ? dayjs(tanggal).format("YYYY-MM-DD") : defaultDate,
        }
        console.log(pageTitle + 'untuk save', data)


        const response = id ? await UpdateLHP(data, id) : await CreateLHP(data)
        console.log(response)
        if (response.success || response.id) {
            message.success(`${pageTitle} Disimpan!`)
            reload()
            setLHP(null)
            close()
        }

        setLoading(false)
    }

    useEffect(() => {
        if (id) {
            handleGet()
            return
        } else {
            setLHP(initial)
            setLoading(false)
        }

        return () => {
            setLHP(null)
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
            {lhp &&
                <Form
                    onValuesChange={handleUpdate}
                    layout='vertical'
                >
                    <Field
                        type='char'
                        name='nomor'
                        label='Nomor'
                        value={lhp.nomor}
                        required
                    />

                    <FieldTahunKegiatan
                        value={lhp.tahun_id}
                        required
                    />

                    <Field
                        type='date'
                        name='tanggal'
                        label='Tanggal'
                        value={lhp.tanggal}
                    />

                    <Field
                        type='select'
                        name='obyek'
                        label='Obyek'
                        value={lhp.obyek}
                        options={[
                            { value: OBYEK.BLOK_PETAK, label: 'Blok/Petak' },
                            { value: OBYEK.TRASE_JALAN, label: 'Jalan' }
                        ]}
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


