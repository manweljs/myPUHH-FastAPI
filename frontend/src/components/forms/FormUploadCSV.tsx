import React, { useState } from 'react'
import { Alert, Modal, Upload, UploadFile, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons'
import { API_URL } from '@/consts';
import { getToken } from '@/functions';
import { FileType } from '@/types';

interface FormUploadCSVProps {
    url: string;
    open: boolean;
    close: () => void;
    reload: () => void;
    id?: string;
    title?: string;
}


const UploadCSV = async (url: string, data: FormData, id: string): Promise<any> => {
    const endpoint = `${API_URL}${url}?pk=${id}`;
    const method = "POST";
    const headers = {
        'Authorization': `Bearer ${getToken()}`
    };

    const response = await fetch(endpoint, { method, headers, body: data })
        .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))

    return response
};

export function FormUploadCSV(props: FormUploadCSVProps) {
    const { url, open, close, reload, id, title } = props;
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (info: any) => {
        console.log(info);
        setFileList(info.fileList);
    };

    const handleUpload = async () => {
        if (!id) return;
        setLoading(true);
        const data = new FormData();
        if (fileList.length > 0 && fileList[0].originFileObj) {
            data.append('file', fileList[0].originFileObj);
            const response = await UploadCSV(url, data, id);
            console.log(response);
            if (response?.status) {
                setFileList([]);
                reload();
                close();
                message.success('Upload success!');
            } else if (response?.error) {
                setError(response?.error);
                // message.success('Upload success!');

            } else {
                message.error('File error, periksa kembali file anda.');

            }
        }
        setLoading(false);
    };

    const handleClose = () => {
        console.log('first', "kesini")
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
            title={title ? title : 'Upload CSV'}
            okText={'Upload'}
            onOk={handleUpload}
            confirmLoading={loading}

        >
            {error && (
                <Alert className="mb-3" type="error" showIcon message={error} onClose={handleCloseError} />
            )}
            <Upload.Dragger
                accept=".csv"
                beforeUpload={() => false}
                onChange={handleChange}
                fileList={fileList}
                maxCount={1}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-hint">Click or drag file to this area to upload</p>
            </Upload.Dragger>
        </Modal>
    );
}