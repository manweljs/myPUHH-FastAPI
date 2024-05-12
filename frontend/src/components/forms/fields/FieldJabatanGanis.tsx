import React, { useEffect } from 'react'
import { useState } from 'react';
import { GetAllJabatanGanis } from '@/api';
import { BlokType } from '@/types';
import { Field } from '../Field';

interface Props {
    value?: string | null,
    handleUpdate?: (arg: any) => void
    required?: boolean
    name?: string
}

export const FieldJabatanGanis = (props: Props) => {
    const { value, handleUpdate, required, name = "jabatan_id" } = props;
    const [objects, setObjects] = useState<BlokType[]>([])
    const [loading, setLoading] = useState(true)

    const handleGetAll = async () => {
        setLoading(true)
        const response = await GetAllJabatanGanis()
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
            label='Jabatan Ganis'
            value={value}
            options={objects.map((item: BlokType) => ({ value: item.id, label: item.nama }))}
            loading={loading}
            required={required}
        />
    )
}