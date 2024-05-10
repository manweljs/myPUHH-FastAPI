import React from 'react'
import styles from "./global.module.sass"
import { Checkbox, Form, Input, message } from 'antd'

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
}
export function Field(props: FieldsProps) {
    const { type, maxLength, value, name, label, tip, required, onChange, message } = props


    return (
        <div className={styles.field}>

            {type === "char" &&
                <Form.Item
                    label={label || name}
                    name={name}
                    rules={[{ required: required, message: message }]}
                    className={styles.form_item}
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

            <div className={styles.tip}>{tip}</div>
        </div>
    )
}
