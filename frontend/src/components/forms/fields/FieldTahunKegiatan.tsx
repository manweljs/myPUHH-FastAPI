import React, { useEffect } from 'react'
import { useState } from 'react';
import { GetAllTahunKegiatan } from '@/api';
import { KabupatenType, TahunKegiatanType } from '@/types';
import { Field } from '../Field';

interface Props {
    value?: string | null,
    handleUpdate?: (arg: any) => void
    required?: boolean
    name?: string
}

export const FieldTahunKegiatan = (props: Props) => {
    const { value, handleUpdate, required, name = "tahun_id" } = props;
    const [objects, setObjects] = useState<TahunKegiatanType[]>([])
    const [loading, setLoading] = useState(true)

    const handleGetAll = async () => {
        setLoading(true)
        const response = await GetAllTahunKegiatan()
        setObjects(response)
        setLoading(false)
    }

    useEffect(() => {
        handleGetAll()
    }, [])

    return (
        <Field
            type="select"
            name={name}
            label='Tahun Kegiatan'
            value={value}
            options={objects.map((item: TahunKegiatanType) => ({ value: item.id, label: item.tahun }))}
            loading={loading}
            required={required}
        />
    )
}