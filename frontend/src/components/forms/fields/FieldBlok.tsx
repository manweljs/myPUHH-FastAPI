import React, { useEffect } from 'react'
import { useState } from 'react';
import { GetAllBlok } from '@/api';
import { BlokType } from '@/types';
import { Field } from '../Field';

interface Props {
    value?: string | null,
    handleUpdate?: (arg: any) => void
    required?: boolean
    name?: string
}

export const FieldBlok = (props: Props) => {
    const { value, handleUpdate, required, name = "blok_id" } = props;
    const [objects, setObjects] = useState<BlokType[]>([])
    const [loading, setLoading] = useState(true)

    const handleGetAll = async () => {
        setLoading(true)
        const response = await GetAllBlok()
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
            label='Blok'
            value={value}
            options={objects.map((item: BlokType) => ({ value: item.id, label: item.nama }))}
            loading={loading}
            required={required}
        />
    )
}