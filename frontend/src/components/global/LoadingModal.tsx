import { Modal, Progress, Space, Spin } from 'antd'
import React from 'react'
import s from "./global.module.sass"

export function LoadingModal(props: { open: boolean, title?: string, progress?: number }) {
    const { open = false, title = "Loading...", progress } = props

    return (
        <>
            {
                open &&
                <Modal open footer={null} className={s.loading_modal} closable={false} >

                    {
                        progress ?
                            <Progress strokeLinecap="butt" percent={progress} />
                            :
                            <>
                                <Spin />
                                <div>{title}</div>
                            </>
                    }
                </Modal>
            }
        </>
    )
}
