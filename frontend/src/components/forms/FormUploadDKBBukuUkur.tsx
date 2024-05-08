import React, { useState } from 'react'
import { Alert, Modal, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons'
import { UploadDKBBukuUkur } from 'components/buku-ukur/BukuUkurAPI';
import { FileType } from 'types/Main';

interface FormUploadBukuUkurProps {
    open: boolean;
    close: () => void;
    reload: () => void;
    id: string;
}

export function FormUploadDKBBukuUkur(props: FormUploadBukuUkurProps) {
    const { open, close, reload, id } = props;
    const [fileList, setFileList] = useState<FileType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (info: any) => {
        console.log(info);
        setFileList(info.fileList);
    };

    const handleUpload = async () => {
        setLoading(true);
        const data = new FormData();
        if (fileList.length > 0 && fileList[0].originFileObj) {
            data.append('file', fileList[0].originFileObj );
            const response = await UploadDKBBukuUkur(data, id);
            console.log(response);
            if (response.status) {
                setFileList([]);
                reload();
                close();
                message.success('Upload success!');
            } else {
                setError(response.error);
            }
        }
        setLoading(false);
    };

    const handleClose = () => {
        setFileList([]);
        setLoading(false);
        setError(null);
        close();
    };

    const handleCloseError = () => {
        setError(null);
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            title={'Upload Detail Buku Ukur'}
            okText={'Upload'}
            onOk={handleUpload}
            confirmLoading={loading}
        >
            {error && (
                <Alert className="mb-3" type="error" showIcon message={error} onClose={handleCloseError} />
            )}
            <Upload.Dragger accept=".csv" beforeUpload={() => false} onChange={handleChange} fileList={fileList}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-hint">Click or drag file to this area to upload</p>
            </Upload.Dragger>
        </Modal>
    );
}