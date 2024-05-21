import React from 'react'
import styles from "./field.module.sass"
import { Checkbox, DatePicker, Form, Input, InputNumber, message, Radio, Select } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { FORMAT } from '@/consts'
import dayjs from 'dayjs'

type FieldType = "char" | "checkbox" | "select" | "textArea" | "date" | "number" | "file" | "image" | "password" | "email" | "phone" | "time" | "dateTime" | "radioSelect"

export interface FieldsProps {
    type: FieldType
    name: string
    onChange?: (e: any) => void
    maxLength?: number
    loading?: boolean
    value?: any
    label?: string
    tip?: string
    required?: boolean
    message?: string
    options?: any
    className?: string
    multiple?: boolean
}
export function Field(props: FieldsProps) {
    const {
        type,
        maxLength,
        value,
        name,
        label,
        tip,
        required = false,
        onChange,
        message,
        options,
        loading,
        className,
        multiple
    } = props



    return (
        <div className={styles.field}>
            <FormItem
                label={label || name}
                name={name}
                rules={[{ required: required, message: message }]}
                className={styles.form_item}
                initialValue={getInitialValue(value, type)}
            >
                {type === "char" &&
                    <Input
                        name={name}
                        value={value}
                        maxLength={maxLength}
                        required={required}
                        onChange={onChange}
                    />
                }

                {type === "textArea" &&

                    <Input.TextArea
                        name={name}
                        value={value}
                        maxLength={maxLength}
                        required={required}
                        onChange={onChange}
                    />
                }

                {type === "password" &&
                    <Input.Password
                        name={name}
                        value={value}
                        onChange={onChange}
                    />
                }

                {type === "checkbox" &&
                    <Checkbox
                        name={name}
                        value={value}
                        onChange={onChange}
                    />
                }

                {
                    type === "number" &&
                    <InputNumber
                        name={name}
                        value={value}
                        onChange={onChange}
                    />
                }


                {type === "select" &&
                    <Select
                        value={value}
                        onChange={onChange}
                        loading={loading}
                        className={className || "w-100"}
                        mode={multiple ? "multiple" : undefined}
                        showSearch
                        filterOption={(inputValue, option: any) =>
                            option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                        }

                    >
                        {
                            options.map((item: { value: any, label: string }, index: number) => (
                                <Select.Option value={item.value} key={index} >
                                    {item.label}
                                </Select.Option>
                            ))
                        }
                    </Select>
                }

                {type === "date" &&
                    <DatePicker
                        name={name}
                        onChange={onChange}
                        format={FORMAT.DATE}
                    />
                }

                {type === "radioSelect" &&
                    <Radio.Group>
                        {options.map((item: { value: any, label: string }, index: number) => (
                            <Radio.Button value={item.value} key={index}>
                                {item.label}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                }

            </FormItem>
            <div className={styles.tip}>{tip}</div>

        </div>
    )
}


const getInitialValue = (value: any, type: FieldType) => {
    if (type === "date") {
        const now = dayjs().format(FORMAT.DATE)
        const dateValue = value ? dayjs(value) : now
        return dateValue
    }
    return value
}