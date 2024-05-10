import React from 'react'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useUserContext } from '@/hooks/UserContext'
import styles from "./global.module.sass"

export function PageHeader(props: {
    page: string,
    back?: string,
    size?: "small" | "large"

}) {
    const { navigate } = useUserContext()
    const { page, back, size } = props
    return (
        <div className={styles.page_header}>
            <div className={styles.flex_group}>
                {back &&
                    <Button icon={<ArrowLeftOutlined style={{ fontSize: ".9em" }} />}
                        onClick={() => navigate(back)}
                    ></Button>
                }
                <h1 style={{ fontSize: size === "small" ? "1.2em" : "1.5em" }} >{page}</h1>
            </div>
            <div className={styles.search_box}></div>
        </div>
    )
}
