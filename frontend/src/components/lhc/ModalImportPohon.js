import React, { useState } from "react";
import { Alert, Button, Modal, Spin, Upload, message } from 'antd'
import { SearchOutlined, InboxOutlined } from '@ant-design/icons'
import { ImportPohonLHC } from "../../api/CruisingAPI";

export default function ModalImportPohon(props) {
    const { open, close, reload, lhcId } = props;
    const [fileList, setFileList] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = async (info) => {
        console.log(info)
        setFileList(info.fileList)
    }

    const handleUpload = async () => {
        setLoading(true)
        const data = new FormData()
        data.append("file", fileList[0].originFileObj)
        const response = await ImportPohonLHC(data, lhcId)
        console.log(response)
        if (response.status) {
            setFileList([])
            reload()
            close()
            message.success("LHC Updated!")
        } else {
            setError(response.error)
        }
        setLoading(false)
    }

    const handleClose = () => {
        setLoading(false)
        setFileList([])
        setError(null)
        close()
    }

    const handleCloseError = () => {
        setError(null)
    }
    return (
        <Modal open={open}
            onCancel={handleClose}
            title={"Import Pohon"}
            okText={"Upload"}
            onOk={handleUpload}
            confirmLoading={loading}
        >
            {error && <Alert className="mb-3" type="error" showIcon message={error} onClose={handleCloseError} />}
            <Upload.Dragger accept='.csv'
                beforeUpload={() => { return false }}
                onChange={handleChange}
                fileList={fileList}

            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-hint">Click or drag file to this area to upload</p>
            </Upload.Dragger>
        </Modal>
    )
}