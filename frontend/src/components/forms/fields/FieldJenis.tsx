import React, { useEffect } from 'react'
import { useState } from 'react';
import { GetAllBlok, GetAllJenis } from '@/api';
import { BlokType } from '@/types';
import { Field } from '../Field';

interface Props {
    value?: string | null | string[] | undefined | number[] | number,
    handleUpdate?: (arg: any) => void
    required?: boolean
    name?: string
    multiple?: boolean
    label?: string
}

export const FieldJenis = (props: Props) => {
    const { value, required, name = "jenis_id", multiple, label = "Jenis" } = props;
    const [objects, setObjects] = useState<BlokType[]>([])
    const [loading, setLoading] = useState(true)

    const handleGetAll = async () => {
        setLoading(true)
        const response = await GetAllJenis()
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
            label={label}
            value={value}
            options={objects.map((item: BlokType) => ({ value: item.id, label: item.nama }))}
            loading={loading}
            required={required}
            multiple={multiple}
        />
    )
}