import React, { useState, useEffect } from 'react';
import { Space, Table, Input, Button, Modal, Dropdown, Menu } from 'antd';
import UploadFile from '../uploadFile/uploadFile';

const { Search } = Input;

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
              <Menu.Item key="json" onClick={e => handleDownload(e)}>
                JSON
              </Menu.Item>
              <Menu.Item key="text">Text</Menu.Item>
            </Menu>
          }
        >
          <a>Download</a>
        </Dropdown>
        <a>View Rate</a>
      </Space>
    ),
  },
];

const handleDownload = ({key}) => {
    console.log(key);
}

const DynamicTable = ({ fileArray }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
          onClick={showModal}
          style={{ position: 'absolute', right: 0 }}
        >
          Upload
        </Button>
        <Modal
          title='Upload excel file here'
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <UploadFile />
        </Modal>
      </div>
      <Table columns={columns} dataSource={filteredData} />
    </>
  );
};

export default DynamicTable;
