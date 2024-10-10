import { ChangeEvent, useState } from 'react';
import { Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadFile = () => {
    const apiUrl = '/choreo-apis/eydemo/excel-upload-framework/v1';  
    // const apiUrl = window?.configs?.apiUrl ? window.configs.apiUrl : "/";
    const props = {
        name: 'file',
        action: `${apiUrl}/upload_rate_excel`,
        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        // headers: {
        //   authorization: 'authorization-text',
        // },
        onChange(info) {
            if (info.file.status !== 'uploading') {
              console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
              message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} file upload failed.`);
            }
        }
    }


    return (
        <Upload {...props}>
            <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
    )
}

export default UploadFile
