import React from 'react'
import styles from "./field.module.sass"
import { Checkbox, DatePicker, Form, Input, InputNumber, message, Select } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { FORMAT } from '@/consts'
import dayjs from 'dayjs'

type FieldType = "char" | "checkbox" | "select" | "textArea" | "date" | "number" | "file" | "image" | "password" | "email" | "phone" | "time" | "dateTime"

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
        className
    } = props

    return (
        <div className={styles.field}>
            <FormItem
                label={label || name}
                name={name}
                rules={[{ required: required, message: message }]}
                className={styles.form_item}
                initialValue={type === "date" ? dayjs(value) : value}
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

            </FormItem>
            <div className={styles.tip}>{tip}</div>

        </div>
    )
}
