import React, { useEffect, useState } from "react";
import { FieldProps } from "./FieldObyek";
import { GetAllRKT } from "api/SettingAPI";
import { Select } from "antd";
import { TahunKegiatanType } from 'types'


export const FieldRKT: React.FC<FieldProps> = (props) => {
    const { data, handleUpdate, title } = props;

    const [objects, setObjects] = useState<TahunKegiatanType[]>([])
    const [loading, setLoading] = useState(true)
    const handleGetAll = async () => {
        const response = await GetAllRKT()
        console.log('response', response)
        setObjects(response.data)
        setLoading(false)
    }

    useEffect(() => {
        handleGetAll()
    }, [])
    return (
        <div className="field ">
            <div className="label">{title ? title : "RKT"}</div>
            <Select
                value={data.rkt}
                onChange={(e) => handleUpdate({ name: "rkt", value: e })}
                loading={loading}
                className='w-100'
            >
                {
                    objects.map((item, index) => (
                        <Select.Option value={item.id} key={item.id} >
                            {item.tahun}
                        </Select.Option>
                    ))
                }
            </Select>
        </div>
    )
}
