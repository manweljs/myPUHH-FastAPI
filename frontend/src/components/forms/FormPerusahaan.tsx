import { FileType, PerusahaanInType, PerusahaanType } from "@/types"
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { Button, Form, notification, Space, UploadFile } from "antd"
import { Field } from "../global"
import { FieldKabupaten } from "./fields/FieldKabupaten"
import { GetAllKabupaten, GetPresignedUrl, UpdatePerusahaan } from "@/api"
import AntdFileUpload from "./AntdFileUpload"
import styles from "./field.module.sass"
import AntdAWSFileUpload from "./AntdAWSFileUpload"

interface Props {
    perusahaan: PerusahaanType,
    close: () => void,
    reload: () => void,

}

const initialData: PerusahaanInType = {
    nama: "",
    alamat: "",
    telepon: "",
    kabupaten_id: null,
    logo: null,

}

const getOriginalFileUrl = (url: string) => {
    console.log('url untuk di parse', url)
    const decodedUrl = decodeURIComponent(url.split('?')[0])
    console.log('url yg di kembalikan', decodedUrl)
    return decodedUrl
}

export const FormPerusahaan = (props: Props) => {
    const { perusahaan, close, reload } = props
    const [loading, setLoading] = useState(false)
    const [api, contextHolder] = notification.useNotification()
    const [formData, setFormData] = useState<PerusahaanInType>(perusahaan ? {
        ...perusahaan,
        kabupaten_id: perusahaan.kabupaten?.id,
    } : initialData)

    console.log('data', formData)

    useEffect(() => {
        setFormData({
            ...perusahaan,
            kabupaten_id: perusahaan.kabupaten?.id,
        })

    }, [perusahaan]);


    const handleSave = async () => {
        setLoading(true)
        console.log('perusahaan to save', formData)
        const response = await UpdatePerusahaan(formData)
        console.log(response)
        if (response.success) {
            api.success({
                message: 'Data berhasil disimpan'
            })
        }

        setLoading(false)
    }


    const handleFormChange = (e: any) => {
        console.log("form changed", e)
        setFormData((prev: any) => ({
            ...prev, ...e
        }))
    }

    return (
        <Form
            layout='vertical'
            className={styles.form_perusahaan}
            onValuesChange={handleFormChange}
        >
            {contextHolder}
            <Field
                type="char"
                name="nama"
                label='Nama'
                value={formData.nama}
            />
            <Field
                type="textArea"
                name="alamat"
                label='Alamat'
                value={formData.alamat}
            />

            <FieldKabupaten value={formData.kabupaten_id} />

            <FieldLogo data={formData} handleUpdate={handleFormChange} />

            <Space>
                <Button
                    onClick={handleSave}
                    type='primary'
                    loading={loading}
                >Save</Button>
                <Button onClick={close} className='ml-2' >Cancel</Button>
            </Space>


        </Form>
    )
}

const FieldLogo = (props: {
    data: PerusahaanInType,
    handleUpdate: (arg: any) => void
}) => {

    const { data, handleUpdate } = props;
    const [file, setFile] = useState<UploadFile | null>(null)

    const handleChange = async (e: any) => {
        console.log('response', e)
        handleUpdate({
            logo: e
        })
    }

    console.log('data di field logo', data)
    useEffect(() => {
        if (data.logo) {
            setFile({
                uid: "logo-1",
                name: "logo",
                url: data.logo,
            })
        }
    }, []);

    return (
        <AntdAWSFileUpload
            label="logo"
            maxCount={1}
            callback={handleChange}
            file={file}
            tip={[
                "Upload logo perusahaan, logo akan ditampilkan pada laporan-laporan.",
                "Rekomendasi ukuran 200px * 200px dalam format .png transparan background."
            ]}

        />
    )
}
