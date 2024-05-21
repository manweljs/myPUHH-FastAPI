import React, { useEffect, useState } from 'react'
import { Button, Form, message, Modal, } from 'antd'
import { RencanaTebangInType } from '@/types'
import { CreateRencanaTebang, GetRencanaTebang, UpdateRencanaTebang } from '@/api';
import { Field } from './Field';
import dayjs from 'dayjs'
import { OBYEK } from '@/consts';
import { FieldTahunKegiatan } from './fields/FieldTahunKegiatan';
import { FieldJenis } from './fields/FieldJenis';
import { FieldBlok } from './fields/FieldBlok';

const defaultDate = dayjs().format("YYYY-MM-DD")

const initial: RencanaTebangInType = {
    id: undefined,
    nomor: "",
    tahun_id: undefined,
    tanggal: dayjs().toString(),
    obyek: OBYEK.BLOK_PETAK,
    faktor: 0.7

}

interface Props {
    id?: string | null;
    close: () => void;
    reload: () => void;
    open?: boolean;
}


export const FormRencanaTebang = (props: Props) => {

    const { id, close, reload, open } = props
    const [loading, setLoading] = useState(true)
    const [rencanaTebang, setRencanaTebang] = useState<RencanaTebangInType | null>(null)

    const handleGet = async () => {
        if (!id) return
        const response = await GetRencanaTebang(id)
        console.log(response)
        if (response.id || response.success) {
            setRencanaTebang({
                ...response,
            })

        }
        setLoading(false)
    }

    const handleUpdate = (e: any) => {
        setRencanaTebang((prev: any) => ({
            ...prev, ...e
        }))
    }

    const handleSave = async () => {
        if (!rencanaTebang) return
        setLoading(true)
        console.log('rencanaTebang untuk save', rencanaTebang)
        const { tanggal } = rencanaTebang
        const data = {
            ...rencanaTebang,
            tanggal: tanggal ? dayjs(tanggal).format("YYYY-MM-DD") : defaultDate,
            jenis_ids: rencanaTebang.obyek === OBYEK.BLOK_PETAK ? rencanaTebang.jenis_ids : null
        }

        const response = id ? await UpdateRencanaTebang(data, id) : await CreateRencanaTebang(data)
        console.log(response)
        if (response.success || response.id) {
            message.success(`Rencana Tebang Disimpan!`)
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
            setRencanaTebang(initial)
            setLoading(false)
        }
    }, [id]);

    return (
        <Modal
            width={400}
            open={open}
            title="Rencana Tebang"
            onCancel={close}
            footer={null}
        >
            {rencanaTebang &&
                <Form
                    onValuesChange={handleUpdate}
                    layout='vertical'
                >
                    <Field
                        type='date'
                        name='tanggal'
                        label='Tanggal'
                        value={rencanaTebang.tanggal}
                    />

                    <Field
                        type='char'
                        name='nomor'
                        label='Nomor'
                        value={rencanaTebang.nomor}
                        required
                    />

                    <FieldTahunKegiatan
                        value={rencanaTebang.tahun_id}
                        required
                    />


                    <FieldBlok
                        value={rencanaTebang.blok_ids}
                        multiple
                        name='blok_ids'
                    />

                    <Field
                        type="radioSelect"
                        name='obyek'
                        label='Obyek'
                        value={rencanaTebang.obyek}
                        options={[
                            { label: 'Blok/Petak', value: OBYEK.BLOK_PETAK },
                            { label: 'Jalan', value: OBYEK.TRASE_JALAN }
                        ]}
                    />

                    <Field
                        type='number'
                        name='faktor'
                        label='Faktor Exploitasi'
                        value={rencanaTebang.faktor}
                        required
                    />

                    {rencanaTebang.obyek === OBYEK.BLOK_PETAK &&
                        <FieldJenis
                            value={rencanaTebang.jenis_ids}
                            multiple
                            name='jenis_ids'
                            label='Target Jenis'
                        />
                    }


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


