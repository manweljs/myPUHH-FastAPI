import React, { useState } from 'react'
import { Alert, Modal, Upload, UploadFile } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { UploadBarcodeLHCType } from '@/types';
import AntdAWSFileUpload from '../forms/AntdAWSFileUpload';

interface Props {
    open: boolean,
    close: () => void,
    reload: () => void,
    lhcId: string
}

export default function UploadBarcodeModal(props: Props) {

    const { open, close, reload, lhcId } = props;
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [data, setData] = useState<UploadBarcodeLHCType>({
        lhc_id: lhcId,
        file_url: ""
    })


    const handleUpload = async (e: any) => {
        console.log('e', e)
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
            title={"Upload Barcode"}
            okText={"Upload"}
            onOk={handleUpload}
            confirmLoading={loading}
        >
            {error && <Alert className="mb-3" type="error" showIcon message={error} onClose={handleCloseError} />}
            <AntdAWSFileUpload
                callback={handleUpload}
            />
        </Modal>
    )
}
