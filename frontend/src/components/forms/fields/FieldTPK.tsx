import React, { useEffect } from 'react'
import { useState } from 'react';
import { GetAllTPK } from '@/api';
import { TPKType } from '@/types';
import { Field } from '../Field';

interface Props {
    value?: string | null,
    handleUpdate?: (arg: any) => void
    required?: boolean
    name?: string
    label?: string
    className?: string
}

export const FieldTPK = (props: Props) => {
    const { value, handleUpdate, required, name = "tpk_id", label = "TPK" } = props;
    const [objects, setObjects] = useState<TPKType[]>([])
    const [loading, setLoading] = useState(true)

    const handleGetAll = async () => {
        setLoading(true)
        const response = await GetAllTPK()
        setObjects(response)
        setLoading(false)
    }

    useEffect(() => {
        handleGetAll()
    }, [])

    return (
        <Field
            {...props}
            type="select"
            name={name}
            label={label}
            value={value}
            options={objects.map((item: TPKType) => ({ value: item.id, label: item.nama }))}
            loading={loading}
            required={required}
        />
    )
}