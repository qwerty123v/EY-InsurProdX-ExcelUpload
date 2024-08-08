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
    render: (_, record) => {
      
      return (<Space size="middle">
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="json" onClick={e => handleDownload(e,record)}>
                <a id={record.name}>JSON</a>
              </Menu.Item>
              <Menu.Item key="text">Text</Menu.Item>
            </Menu>
          }
        >
          <a>Download</a>
        </Dropdown>
        <a onClick={e => openRateForm(e,record)}>View Rate</a>
      </Space>)
    },
  },
];

const openRateForm = (e,Y) => {

}

const handleDownload = (e,y) => {

    const jsonString  = JSON.stringify(y);
    const blob = new Blob([jsonString], { type: "application/json" });
    let dLink = document.getElementById(y.name);
    dLink.download = y.name+'.json';
    dLink.href = URL.createObjectURL(blob);
}

const DynamicTable = ({ fileArray }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

const DynamicModal = ({component}) => {
    return (
        <Modal
          title='Upload excel file here'
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {{component}}
        </Modal>
    )
}

export default DynamicTable;
