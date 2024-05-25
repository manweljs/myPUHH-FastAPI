import React, { useEffect, useState } from 'react'
import { Button, Form, message, Modal, Space, } from 'antd'
import { LHCInType } from '@/types'
import { CreateLHC, GetLHC, UpdateLHC } from '@/api';
import { Field } from './Field';
import dayjs from 'dayjs'
import { OBYEK } from '@/consts';
import { FieldTahunKegiatan } from './fields/FieldTahunKegiatan';
import { FieldBlok } from './fields/FieldBlok';

const defaultDate = dayjs().format("YYYY-MM-DD")

const initial: LHCInType = {
    id: null,
    nomor: "",
    tahun_id: null,
    tanggal: dayjs().toString(),
    obyek: OBYEK.BLOK_PETAK,

}

interface Props {
    id?: string | null;
    close: () => void;
    reload: () => void;
    open?: boolean;
}


export const FormLHC = (props: Props) => {

    const { id, close, reload, open } = props
    const [loading, setLoading] = useState(true)
    const [lhc, setLHC] = useState<LHCInType | null>(null)

    const handleGet = async () => {
        if (!id) return
        const response = await GetLHC(id)
        console.log(response)
        if (response.id || response.success) {

            setLHC({
                ...response,
            })

        }
        setLoading(false)
    }

    const handleUpdate = (e: any) => {
        setLHC((prev: any) => ({
            ...prev, ...e
        }))
    }

    const handleSave = async () => {
        if (!lhc) return
        setLoading(true)
        console.log('LHC untuk save', lhc)
        const { tanggal } = lhc
        const data = {
            ...lhc,
            tanggal: tanggal ? dayjs(tanggal).format("YYYY-MM-DD") : defaultDate,
        }

        const response = id ? await UpdateLHC(data, id) : await CreateLHC(data)
        console.log(response)
        if (response.success || response.id) {
            message.success(`LHC Disimpan!`)
            reload()
            close()
        } else {
            message.error(response.details || `Gagal menyimpan LHC!`)

        }

        setLoading(false)
    }

    useEffect(() => {
        if (id) {
            handleGet()
            return
        } else {
            setLHC(initial)
            setLoading(false)
        }
    }, [id]);

    return (
        <Modal
            width={400}
            open={open}
            title="LHC"
            onCancel={close}
            footer={null}
        >
            {lhc &&
                <Form
                    onValuesChange={handleUpdate}
                    layout='vertical'
                >
                    <Field
                        type='char'
                        name='nomor'
                        label='Nomor'
                        value={lhc.nomor}
                        required
                    />

                    <FieldTahunKegiatan
                        value={lhc.tahun_id}
                        required
                    />

                    <FieldBlok value={lhc.blok_id} required />

                    <Field
                        type='date'
                        name='tanggal'
                        label='Tanggal'
                        value={lhc.tanggal}
                    />

                    <Field
                        type="radioSelect"
                        name='obyek'
                        label='Obyek'
                        value={lhc.obyek}
                        options={[
                            { label: 'Blok/Petak', value: OBYEK.BLOK_PETAK },
                            { label: 'Jalan', value: OBYEK.TRASE_JALAN }
                        ]}
                    />



                    <Space className='mt-4' >
                        <Button
                            onClick={handleSave}
                            type='primary'
                            loading={loading}
                        >
                            Save
                        </Button>
                        <Button
                            onClick={close}
                        >
                            Cancel
                        </Button>

                    </Space>
                </Form>
            }
        </Modal>
    )
}


