import { RencanaTebangType } from '@/types'
import React from 'react'

interface Props {
    rencanaTebang?: RencanaTebangType
}
export function RencanaTebangSummary(props: Props) {
    const { rencanaTebang } = props
    return (
        <div>RencanaTebangSummary</div>
    )
}
