import React, { useEffect } from 'react'
import { Select } from 'antd'
import { useState } from 'react';
import { GetAllKabupaten } from '@/api';
import { KabupatenType } from '@/types';
import { Field } from '../Field';

interface Props {
    value?: string,
    handleUpdate: (arg: any) => void
}

export const FieldKabupaten = (props: Props) => {
    const { value, handleUpdate } = props;
    const [objects, setObjects] = useState<KabupatenType[]>([])
    const [loading, setLoading] = useState(true)

    const handleGetAll = async () => {
        const response = await GetAllKabupaten()
        setObjects(response)
        setLoading(false)
    }

    useEffect(() => {
        handleGetAll()
    }, [])
    return (
        <div className="field ">
            <Field
                type="select"
                name="kabupaten"
                label='Kabupaten / Kota'
                value={value}
                options={objects.map((item: KabupatenType) => ({ value: item.id, label: item.nama }))}
                onChange={(e: any) => handleUpdate({ name: 'kabupaten', value: e })}
            />
        </div>
    )
}