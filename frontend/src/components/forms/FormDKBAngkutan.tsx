import React, { useEffect, useState } from 'react'
import { Button, Form, message, Modal, Space, } from 'antd'
import { DKBAngkutanInType, LHPInType } from '@/types'
import { CreateDKBAngkutan, CreateLHP, GetBukuUkur, GetDKBAngkutan, GetLHP, UpdateDKBAngkutan, UpdateLHP } from '@/api';
import { Field } from './Field';
import dayjs from 'dayjs'
import { FieldTahunKegiatan } from './fields/FieldTahunKegiatan';
import { ALAT_ANGKUT, OBYEK } from '@/consts';
import { createOptionsFromEnum } from '@/functions';
import { FieldTPK } from './fields/FieldTPK';
import FIcon from '../global/FIcon';
import styles from "./field.module.sass"

const defaultDate = dayjs().format("YYYY-MM-DD")
const pageTitle = "DKB Angkutan"

const initial: DKBAngkutanInType = {
    id: undefined,
    nomor_dkb: "",
    tpk_asal_id: undefined,
    tpk_tujuan_id: undefined,
    tanggal: dayjs().toString(),
    alat_angkut: 0,
    nama_alat_angkut: "",
    nomor_dokumen: "",
    dokumen_url: "",
}

interface Props {
    id?: string | null;
    close: () => void;
    reload: () => void;
    open?: boolean;
}


export const FormDKBAngkutan = (props: Props) => {

    const { id, close, reload, open } = props
    const [loading, setLoading] = useState(true)
    const [dkbAngkutan, setDKBAngkutan] = useState<DKBAngkutanInType | null>(null)

    const handleGet = async () => {
        if (!id) return
        const response = await GetDKBAngkutan(id)
        console.log(response)
        if (response.id || response.success) {
            setDKBAngkutan({
                ...response,
                tpk_asal_id: response.tpk_asal.id,
                tpk_tujuan_id: response.tpk_tujuan.id
            })

        }
        setLoading(false)
    }

    const handleUpdate = (e: any) => {
        setDKBAngkutan((prev: any) => ({
            ...prev, ...e
        }))
    }

    const handleSave = async () => {
        if (!dkbAngkutan) return
        setLoading(true)
        const { tanggal } = dkbAngkutan
        const data = {
            ...dkbAngkutan,
            tanggal: tanggal ? dayjs(tanggal).format("YYYY-MM-DD") : defaultDate,
        }
        console.log(pageTitle + 'untuk save', data)


        const response = id ? await UpdateDKBAngkutan(data, id) : await CreateDKBAngkutan(data)
        console.log(response)
        if (response.success || response.id) {
            message.success(`${pageTitle} Disimpan!`)
            reload()
            setDKBAngkutan(null)
            close()
        }

        setLoading(false)
    }

    useEffect(() => {
        if (id) {
            handleGet()
            return
        } else {
            setDKBAngkutan(initial)
            setLoading(false)
        }

        return () => {
            setDKBAngkutan(null)
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
            {dkbAngkutan &&
                <Form
                    onValuesChange={handleUpdate}
                    layout='vertical'
                >
                    <Field
                        type='date'
                        name='tanggal'
                        label='Tanggal'
                        value={dkbAngkutan.tanggal}
                    />

                    <Field
                        type='char'
                        name='nomor_dkb'
                        label='Nomor DKB'
                        value={dkbAngkutan.nomor_dkb}
                        required
                    />

                    <Space className={styles.tpk_group}>
                        <FieldTPK
                            value={dkbAngkutan.tpk_asal_id}
                            required
                            name='tpk_asal_id'
                            label='TPK Asal'
                        />
                        <span> <FIcon name='fi-rr-arrow-small-right' /> </span>
                        <FieldTPK
                            value={dkbAngkutan.tpk_tujuan_id}
                            required
                            name='tpk_tujuan_id'
                            label='TPK Tujuan'
                        />

                    </Space>


                    <Field
                        type='select'
                        name='alat_angkut'
                        label='Alat Angkut'
                        value={dkbAngkutan.alat_angkut}
                        options={createOptionsFromEnum(ALAT_ANGKUT)}
                    />

                    <Field
                        type='char'
                        name='nama_alat_angkut'
                        label='Nama Alat Angkut'
                        value={dkbAngkutan.nama_alat_angkut}
                    />

                    <Field
                        type='char'
                        name='nomor_dokumen'
                        label='Nomor Dokumen'
                        value={dkbAngkutan.nomor_dokumen}
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


