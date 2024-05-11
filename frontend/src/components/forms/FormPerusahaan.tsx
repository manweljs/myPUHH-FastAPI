import { FileType, PerusahaanType } from "@/types"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Button, Form, notification } from "antd"
import { Field } from "../global"
import { FieldKabupaten } from "./fields/FieldKabupaten"
import { UpdatePerusahaan } from "@/api"
import AntdFileUpload from "./AntdFileUpload"
import styles from "./field.module.sass"

interface Props {
    perusahaan: PerusahaanType,
    setPerusahaan: Dispatch<SetStateAction<PerusahaanType | null>>
    close: () => void

}


export const FormPerusahaan = (props: Props) => {
    const { perusahaan, setPerusahaan, close } = props
    const [loading, setLoading] = useState(false)
    const [api, contextHolder] = notification.useNotification()

    const handleUpdate = ({ name, value }: any) => {
        setPerusahaan((prev: any) => ({
            ...prev, [name]: value
        }))
    }

    const handleSave = async () => {
        setLoading(true)
        const response = await UpdatePerusahaan(perusahaan)
        console.log(response)
        if (response.success) {
            api.success({
                message: 'Data berhasil disimpan'
            })
        }

        setLoading(false)
    }

    console.log('perusahaan', perusahaan)

    return (
        <Form
            layout='vertical'
            className={styles.form_perusahaan}
        >
            {contextHolder}
            <Field
                type="char"
                name="nama"
                label='Nama'
                value={perusahaan.nama}
                onChange={(e) => handleUpdate({ name: 'nama', value: e.target.value })}
            />
            <Field
                type="textArea"
                name="alamat"
                label='Alamat'
                value={perusahaan.alamat}
                onChange={(e) => handleUpdate({ name: 'alamat', value: e.target.value })}
            />

            <FieldKabupaten value={perusahaan.kabupaten?.id} handleUpdate={handleUpdate} />

            <Field
                type="char"
                name="telepon"
                label='Telepon'
                value={perusahaan.telepon}
                onChange={(e) => handleUpdate({ name: 'telepon', value: e.target.value })}
            />
            <FieldLogo data={perusahaan} handleUpdate={handleUpdate} />
            <div className="group mt-5">
                <Button
                    onClick={handleSave}
                    type='primary'
                    loading={loading}
                >Save</Button>
                <Button onClick={close} className='ml-2' >Cancel</Button>
            </div>

        </Form>
    )
}

const FieldLogo = (props: {
    data: PerusahaanType,
    handleUpdate: (arg: any) => void
}) => {

    const { data, handleUpdate } = props;
    const [file, setFile] = useState<FileType | null>(null)

    const handleChange = (e: any) => {
        console.log(e)
        setFile(e.file)
    }


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
        <AntdFileUpload
            label="logo"
            maxCount={1}
            callback={handleChange}
            filekey="file"
            file={file}
            tip={[
                "Upload logo perusahaan, logo akan ditampilkan pada laporan-laporan.",
                "Rekomendasi ukuran 200px * 200px dalam format .png transparan background."
            ]}

        />
    )
}
