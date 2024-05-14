import React, { useEffect, useState } from 'react';
import { Upload, UploadFile as UploadFileType } from 'antd';
import { UploadOutlined, DownloadOutlined, InboxOutlined } from '@ant-design/icons';
import { UploadFile, UploadFileToAWS } from '@/api/UmumAPI';
import { FileType } from '@/types';
import styles from "./field.module.sass"
import FormItem from 'antd/es/form/FormItem';



interface Props {
    maxCount?: number
    callback: (response: any) => void
    file?: UploadFileType | null
    placeholder?: string
    listType?: string
    tip?: string | string[]
    label?: string
    dropFile?: boolean
}

export default function AntdAWSFileUpload(props: Props) {
    const { maxCount = 1, callback, file, placeholder, listType, tip, label, dropFile = false } = props
    const [fileList, setFileList] = useState<UploadFileType[]>([]);

    // console.log(file)
    useEffect(() => {
        file && setFileList([file])
    }, [file]);

    const handleChange = async (info: { file: UploadFileType, fileList: UploadFileType[] }) => {
        let file = info.file
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

    };

    const handleUpload = async (file: FileType) => {

        const response = await UploadFileToAWS(file)
        return response
    };

    const handleDownload = async () => {

    }


    console.log("fileList ", fileList)

    return (
        <FormItem
            label={label}
        >
            {!dropFile &&
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
            }

            {dropFile &&
                <Upload.Dragger accept='.csv'
                    beforeUpload={() => { return false }}
                    onChange={handleChange}
                    fileList={fileList}
                    maxCount={maxCount}

                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-hint">Click or drag file to this area to upload</p>
                </Upload.Dragger>
            }

            {(tip && Array.isArray(tip)) ?
                tip.map((item, index) => (
                    <div key={index} className={styles.tip}>{item}</div>
                )) :
                <div className={styles.tip}>{tip}</div>
            }

        </FormItem>
    );
}
