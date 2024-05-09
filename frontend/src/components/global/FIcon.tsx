import React from 'react'

interface Props {
    name: string
    size?: string | number
    color?: string
}
export default function FIcon({ name, size = '1rem', color }: Props) {
    const fontSize = typeof size === 'number' ? `${size}px` : size;
    return <i className={`fi ${name}`} style={{ fontSize, color }} />;
}