import { LHCType } from '@/types'
import React from 'react'
import s from "./lhc.module.sass"
import LHCRekapitulasi from './LHCRekapitulasi'

export default function LHCDetailSummary(props: { data: LHCType | null }) {
    const { data } = props
    console.log('data', data)
    return (
        <div className={s.summary}>
            <p>Nomor: {data?.nomor}</p>
            {
                data?.id &&
                <LHCRekapitulasi lhc_id={data?.id} />
            }
        </div>
    )
}
