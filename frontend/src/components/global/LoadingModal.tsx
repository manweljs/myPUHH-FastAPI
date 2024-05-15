import { Modal, Space, Spin } from 'antd'
import React from 'react'
import s from "./global.module.sass"

export function LoadingModal(props: { open: boolean }) {
    const { open = false } = props

    return (
        <>
            {
                open &&
                <Modal open footer={null} className={s.loading_modal} closable={false} >
                    <Space>
                        <Spin />
                        <div>Loading...</div>
                    </Space>
                </Modal>
            }
        </>
    )
}
