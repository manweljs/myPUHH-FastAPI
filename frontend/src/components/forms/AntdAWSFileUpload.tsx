import React, { useEffect, useState } from 'react';
import { Upload, UploadFile as UploadFileType } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { UploadFile, UploadFileToAWS } from '@/api/UmumAPI';
import { FileType } from '@/types';
import styles from "./field.module.sass"
import FormItem from 'antd/es/form/FormItem';



interface Props {
    maxCount: number
    filekey: string
    callback: (response: any) => void
    file: FileType | null
    placeholder?: string
    listType?: string
    tip?: string | string[]
    label?: string
}

export default function AntdAWSFileUpload(props: Props) {
    const { maxCount, filekey, callback, file, placeholder, listType, tip, label } = props
    const [fileList, setFileList] = useState<FileType[]>([]);

    // console.log(file)
    useEffect(() => {
        file && setFileList([file])
    }, [file]);

    const handleChange = async (info: { file: FileType, fileList: FileType[] }) => {
        let file = info.file
        let response
        if (info.file.status === "removed") {
            setFileList([])
            return
        } else {
            file.status = 'uploading';
            file.percent = 30
            setFileList([file]);
            const url = await handleUpload(info.file)

            const updatedFileList = info.fileList[0]
            updatedFileList.percent = 100
            setFileList([updatedFileList])
            callback(url.split('?')[0])
        }

        // setFileList([info.file])
    };

    const handleUpload = async (file: FileType) => {

        const response = await UploadFileToAWS(file)
        return response
    };

    const handleDownload = async () => {

    }


    // console.log(fileList)

    return (
        <FormItem
            label={label}
        >
            <Upload
                listType="picture-card"
                maxCount={maxCount}
                fileList={fileList as UploadFileType<any>[]}
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
