import React from "react";
import { FieldProps } from "./FieldObyek";
import { DatePicker } from "antd";
import dayjs from "dayjs";
export const dateFormat = "YYYY-MM-DD";



export const FieldTanggal: React.FC<FieldProps> = (props) => {
    const { data, handleUpdate, title } = props;

    return (
        <div className="field ">
            <div className="label">{title ? title : "Tanggal"}</div>
            <DatePicker
                value={dayjs(data.tanggal ? data.tanggal : "")}
                onChange={e => handleUpdate({ name: 'tanggal', value: dayjs(e).format(dateFormat) })}
                format={"DD-MM-YYYY"}
                allowClear={false}
            />

        </div>
    )
}