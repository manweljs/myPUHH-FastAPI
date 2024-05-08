import React, { useEffect, useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { getToken } from '../../functions';
import { HOST } from '../..';

export default function AntdFileUpload(props) {
    const { endpoint, maxCount, filekey, callback, file, placeholder, listType } = props
    const [fileList, setFileList] = useState([]);

    // console.log(file)
    useEffect(() => {
        file && setFileList([file])
    }, [file]);

    const handleChange = async (info) => {
        let file = info.file
        let response
        if (info.file.status === "removed") {
            setFileList([])
            return
        } else {
            file.status = 'uploading';
            file.percent = 30
            setFileList([file]);
            response = await handleUpload(info.file)
            const updatedFileList = info.fileList[0]
            updatedFileList.percent = 100
            setFileList([updatedFileList])
            callback(response)
        }

        // setFileList([info.file])
    };

    const handleUpload = async (file) => {
        const method = "POST"
        const headers = {
            "Authorization": `Bearer ${getToken()}`
        }
        const data = new FormData()
        data.append(filekey, file)

        const response = await fetch(HOST + endpoint, { method, headers, body: data })
            .then(r => r.json()).then(r => { return r }).catch(err => console.log(err))
        return response
    };

    const handleDownload = async () => {

    }


    // console.log(fileList)

    return (
        <Upload
            listType="picture-card"
            maxCount={maxCount}
            fileList={fileList}
            beforeUpload={() => { return false }}
            onChange={handleChange}
            onDownload={handleDownload}
            showUploadList={{
                showDownloadIcon: false,
                showPreviewIcon: false,
                downloadIcon: <DownloadOutlined />,
            }}
        >
            {
                maxCount && fileList.length < maxCount &&
                <span><UploadOutlined /> Upload</span>
            }
        </Upload>
    );
}
