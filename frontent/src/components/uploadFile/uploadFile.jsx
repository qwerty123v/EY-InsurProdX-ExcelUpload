import { ChangeEvent, useState } from 'react';
import { Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadFile = () => {
    // const apiUrl = '/choreo-apis/eydemo/excel-upload-framework/v1';  
    const apiUrl = window?.configs?.apiUrl ? window.configs.apiUrl : "/";
    const props = {
        name: 'file',
        action: `${apiUrl}/upload_rate_excel`,
        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        // headers: {
        //     "api-key": 'eyJraWQiOiJnYXRld2F5X2NlcnRpZmljYXRlX2FsaWFzIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJjNGMyYjJhZC1lZDRkLTQ5NjEtYjU3Zi04OTMzZWU4ZWE5NGNAY2FyYm9uLnN1cGVyIiwiYXVkIjoiY2hvcmVvOmRlcGxveW1lbnQ6c2FuZGJveCIsImlzcyI6Imh0dHBzOlwvXC9zdHMuY2hvcmVvLmRldjo0NDNcL2FwaVwvYW1cL3B1Ymxpc2hlclwvdjJcL2FwaXNcL2ludGVybmFsLWtleSIsImtleXR5cGUiOiJTQU5EQk9YIiwic3Vic2NyaWJlZEFQSXMiOlt7InN1YnNjcmliZXJUZW5hbnREb21haW4iOm51bGwsIm5hbWUiOiJFeGNlbCB1cGxvYWQgZnJhbWV3b3JrIC0gRmlsZSBUcmFuc2Zvcm1hdGlvbiBFbmRwb2ludCIsImNvbnRleHQiOiJcLzZhYzE5MDI5LTgzNDEtNGZmYS05MjM4LWExNTU0OWU5YTA5ZlwvZXlkZW1vXC9leGNlbC11cGxvYWQtZnJhbWV3b3JrXC92MS4wIiwicHVibGlzaGVyIjoiY2hvcmVvX3Byb2RfYXBpbV9hZG1pbiIsInZlcnNpb24iOiJ2MS4wIiwic3Vic2NyaXB0aW9uVGllciI6bnVsbH1dLCJleHAiOjE3Mjg1NzEzNDMsInRva2VuX3R5cGUiOiJJbnRlcm5hbEtleSIsImlhdCI6MTcyODU3MDc0MywianRpIjoiZjM3ZTk3MWYtNTkzNC00MzgwLTliZjEtOTkzMGRlMzA2MmNkIn0.IwT4BwSBlIY4tUP8-swKZ5DTnTROSqZt_7EIkyMFKk5xhSpRvmXMjOv8fW2OKgGnxjBOf7Y9KkVIgvlPSWDkJ-OXJbXYREEj1rUFsvlzcQ5Q9AvGHIFZ5j_yaao5s5kp6zECduwnk4qrmzWXGKMasK_l2LFgICefpEo8y2eBI3RpTZcG0MTm4uyfxE8OAbPUIagfVI6mRaWkDWd-50h1Q0HnW7QZL_idX1Wq7U8Hn5a8luSY-T-jhEUQisGo7sU515LobiObvAu1t0uLXgtJMCfHN045zM6ZRRWCSjfvx_ZyHtjlNSqf0CBKk_mFngTfrPrx919lc8BYofl9RwcWcNsJD8JcyA1Q_wHD5PMYdcRXrXSyyp6TNw3QB-kLL8apdVicaYIcZCXeii_rDrewT5vWUa1X4927wEx18uqUehkAfof-ls0M1ppb48EpSh3N9sr9ygO2zLzrn8i-D9Gvkgwz2jKVbsvItuxlx-kXB9R1uFtuaewMdBPWW9ghP-FxZXWphJIU3EC4TF8Vqx36lRrFb6BFFG2okHFuQAGYYi6d5ostv8QYQ-iTkaEYfJ56UatGa20OXTG6w7eTYrOf7tFziPyt2hui47lApicB8WpZHd5YDub5AU9MC-IORxyPWndA3URdthNwAgce1AtFvwqloyIitpvvQ2hyUhhkErE'
        //   // authorization: 'authorization-text',
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
