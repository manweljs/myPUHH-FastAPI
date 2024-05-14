import React, { useEffect, useState } from 'react';
import { Upload, UploadFile } from 'antd';
import { UploadOutlined, DownloadOutlined, InboxOutlined } from '@ant-design/icons';
import { UploadFile as UploadFileToServer } from '@/api/UmumAPI';
import { FileType } from '@/types';
import styles from "./field.module.sass"
import FormItem from 'antd/es/form/FormItem';



interface Props {
    maxCount: number
    filekey: string
    callback: (response: any) => void
    file: UploadFile | null
    placeholder?: string
    listType?: string
    tip?: string | string[]
    label?: string
}

export default function AntdFileUpload(props: Props) {
    const { maxCount = 1, filekey, callback, file, placeholder, listType, tip, label } = props
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    // console.log(file)
    useEffect(() => {
        file && setFileList([file])
    }, [file]);

    const handleChange = async (info: { file: UploadFile, fileList: UploadFile[] }) => {
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
    };

    const handleUpload = async (file: FileType) => {
        const response = await UploadFileToServer(file, filekey)
            .then(r => r.json())
            .then(r => { return r })
            .catch(err => console.log(err))
        return response
    };

    const handleDownload = async () => {

    }

    return (
        <FormItem
            label={label}
        >
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



            {(tip && Array.isArray(tip)) ?
                tip.map((item, index) => (
                    <div key={index} className={styles.tip}>{item}</div>
                )) :
                <div className={styles.tip}>{tip}</div>
            }

        </FormItem>
    );
}
