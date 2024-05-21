import RencanaTebangDetail from '@/components/rencana-tebang/RencanaTebangDetail'
import React from 'react'

export default function page(props: { params: { id: string } }) {
    const id = props.params.id
    return (
        <RencanaTebangDetail id={id} />
    )
}
