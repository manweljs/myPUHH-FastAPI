import LHCDetail from '@/components/lhc/LHCDetail'
import React from 'react'

export default function page(props: { params: { id: string } }) {
    const { params } = props
    return (
        <LHCDetail id={params.id} />
    )
}
