import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'


import "./global.css"
export default function PageHeader(props) {
    const navigate = useNavigate()
    const { page, back, size } = props
    return (
        <div className="page-header">
            <div className="flex-group">
                {back &&
                    <Button icon={<ArrowLeftOutlined style={{ fontSize: ".9em" }} />}
                        onClick={() => navigate(back)}
                    ></Button>
                }
                <h1 style={{ fontSize: size === "small" ? "1.2em" : "1.5em" }} >{page}</h1>
            </div>
            <div className="search-box"></div>
        </div>
    )
}
