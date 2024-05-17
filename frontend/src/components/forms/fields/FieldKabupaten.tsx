import React, { useEffect } from 'react'
import { useState } from 'react';
import { GetAllKabupaten } from '@/api';
import { KabupatenType } from '@/types';
import { Field } from '../Field';

interface Props {
    value?: string | number | null,
    handleUpdate?: (arg: any) => void
}

export const FieldKabupaten = (props: Props) => {
    const { value, handleUpdate } = props;
    const [objects, setObjects] = useState<KabupatenType[]>([])
    const [loading, setLoading] = useState(true)

    const handleGetAll = async () => {
        setLoading(true)
        const response = await GetAllKabupaten()
        setObjects(response)
        setLoading(false)
    }

    useEffect(() => {
        handleGetAll()
    }, [])

    return (
        <Field
            type="select"
            name="kabupaten_id"
            label='Kabupaten / Kota'
            value={value}
            options={objects.map((item: KabupatenType) => ({ value: item.id, label: item.nama }))}
            loading={loading}
            required
        />
    )
}