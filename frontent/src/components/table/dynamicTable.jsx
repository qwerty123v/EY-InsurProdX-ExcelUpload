import React, { useState, useEffect } from 'react';
import { Space, Table, Input, Button, Modal, Dropdown, Menu, Form } from 'antd';
import UploadFile from '../uploadFile/uploadFile';
import axios from 'axios';

const { Search } = Input;

const DynamicTable = ({ fileArray }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    const data = fileArray.map((el, i) => ({
      key: i,
      name: el.Sheet,
      age: el['X-axis'].age,
    }));
    setFilteredData(data);
  }, [fileArray]);

  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      const filtered = fileArray.filter((item) =>
        item.Sheet.toLowerCase().includes(value.toLowerCase())
      ).map((el, i) => ({
        key: i,
        name: el.Sheet,
        age: el['X-axis'].age,
      }));
      setFilteredData(filtered);
    } else {
      const data = fileArray.map((el, i) => ({
        key: i,
        name: el.Sheet,
        age: el['X-axis'].age,
      }));
      setFilteredData(data);
    }
  };

  const handleDownload = (e, record) => {
    const jsonString = JSON.stringify(record);
    const blob = new Blob([jsonString], { type: "application/json" });
    const dLink = document.createElement('a');
    dLink.download = `${record.name}.json`;
    dLink.href = URL.createObjectURL(blob);
    dLink.click();
  };

  const openRateForm = (record, type) => {
    if (type == 'viewRate') {
      setModalTitle('View premium rate')
      setModalContent(<CalculatePremiumForm />);
    } else {
      setModalTitle('Upload excel file here')
      setModalContent(<UploadFile />);
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="json" onClick={(e) => handleDownload(e, record)}>
                  <a id={record.name}>JSON</a>
                </Menu.Item>
                <Menu.Item key="text">Text</Menu.Item>
              </Menu>
            }
          >
            <a>Download</a>
          </Dropdown>
          <a onClick={() => openRateForm(record, 'viewRate')}>View Rate</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className='search-upload'>
        <Search
          placeholder='Search by name'
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: 16, width: 250 }}
        />
        <Button
          type='primary'
          onClick={() => openRateForm(true, 'upload')}
          style={{ position: 'absolute', right: 0 }}
        >
          Upload
        </Button>
      </div>
      <Table columns={columns} dataSource={filteredData} />
      <DynamicModal 
        title={modalTitle}
        component={modalContent}
        showModal={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel} />
    </>
  );
};

const CalculatePremiumForm = () => {
  const [premiumPrc, setPremiumPrc] = useState(0);

  const onFinish = async (values) => {
    setPremiumPrc(155);
    return;
    console.log('Success:', values);
    //Call API here
    try {
      const {gender,tobacco,productTerm, age, ppt} = values;
      const fromDate = "2024-04-01"; //Hard coded
      //const response = await axios.post(`http://localhost:5000/excelupload/single_premium_record?age=${age}&ppt=${ppt}&from=${fromDate}&gender=${gender}&variant_code=V01&product_term=${productTerm}&tobacco=${tobacco}`)
      console.log(response);
      if (response.status == "success" && response.data) {
        //setPremiumPrc(response.data.premium);
        setPremiumPrc(155);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Gender"
        name="gender"
        rules={[
          {
            required: true,
            message: 'This field is required!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Tobacco"
        name="tobacco"
        rules={[
          {
            required: true,
            message: 'This field is required!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Product Term"
        name="productTerm"
        rules={[
          {
            required: true,
            message: 'This field is required!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Age"
        name="age"
        rules={[
          {
            required: true,
            message: 'This field is required!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="PPT"
        name="ppt"
        rules={[
          {
            required: true,
            message: 'This field is required!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Varient Code"
        name="varientCode"
        rules={[
          {
            required: true,
            message: 'This field is required!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      </Form>
      <p className='center-p'>{premiumPrc ? `Premium Price is ${premiumPrc}` : ""}</p>
    </>
  )
}

const DynamicModal = ({ component, showModal, handleOk, handleCancel, title }) => {
  return (
    <Modal
      title={title}
      open={showModal}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {component}
    </Modal>
  )
}

export default DynamicTable;
