import React from 'react';
import { Input } from 'antd';
import { FieldProps } from './FieldObyek';

export const FieldNomor: React.FC<FieldProps> = (props) => {
    const { data, handleUpdate, title } = props;
    return (
        <div className="field">
            <div className="label">{title ? title : 'Nomor'}</div>
            <Input
                value={data.nomor}
                onChange={(e) => handleUpdate({ name: 'nomor', value: e.target.value })}
            />
        </div>
    );
};

