import React from 'react'
import styles from "./field.module.sass"
import { Checkbox, Form, Input, InputNumber, message, Select } from 'antd'

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
    const { type, maxLength, value, name, label, tip, required = false, onChange, message, options, loading, className } = props
    return (
        <div className={styles.field}>

            {type === "char" &&
                <Form.Item
                    label={label || name}
                    name={name}
                    rules={[{ required: required, message: message }]}
                    className={styles.form_item}
                    initialValue={value}

                >
                    <Input
                        name={name}
                        value={value}
                        maxLength={maxLength}
                        required={required}
                        onChange={onChange}
                    />
                </Form.Item>
            }

            {type === "password" &&
                <Form.Item
                    label={label || name}
                    name={name}
                    rules={[{ required: required, message: message }]}
                    className={styles.form_item}
                >
                    <Input.Password
                        name={name}
                        value={value}
                        onChange={onChange}
                    />
                </Form.Item>
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
                <Form.Item
                    label={label || name}
                    name={name}
                    rules={[{ required: required, message: message }]}
                    className={styles.form_item}
                    initialValue={value}

                >
                    <InputNumber
                        name={name}
                        value={value}
                        onChange={onChange}
                    />
                </Form.Item>
            }


            {type === "select" &&
                <Form.Item
                    label={label || name}
                    name={name}
                    rules={[{ required: required, message: message }]}
                    className={styles.form_item}
                >
                    <Select
                        value={value}
                        defaultValue={value}
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
                </Form.Item>
            }

            <div className={styles.tip}>{tip}</div>

        </div>
    )
}
