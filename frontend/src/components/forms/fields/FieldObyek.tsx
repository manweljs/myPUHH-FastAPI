import React from 'react'
import { Radio } from 'antd';
import dayjs from 'dayjs';

export interface FieldProps {
    data: any;
    title?: string;
    handleUpdate: (update: { name: string; value: any }) => void;
}

export const FieldObyek: React.FC<FieldProps> = (props) => {
    const { data, handleUpdate } = props;
    return (
        <div className="field ">
            <div className="label">Obyek</div>
            <Radio.Group
                value={data.obyek}
                onChange={e => handleUpdate({ name: 'obyek', value: e.target.value })}
            >
                <Radio.Button value={1} >Petak / Blok</Radio.Button>
                <Radio.Button value={2} >Trase Jalan</Radio.Button>
            </Radio.Group>
        </div>
    )
}
