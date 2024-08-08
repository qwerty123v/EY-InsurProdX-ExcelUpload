import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Modal } from 'antd';
import UploadFile from './components/uploadFile/uploadFile'
import DynamicTable from './components/table/dynamicTable'

const dummyData = [
  {
      "_id": 1,
      "rate_id": "c1",
      "product_code": "po1",
      "Gender": "M,F,T",
       "Tobacco": "Y",                   // Y if the individual uses tobacco, N otherwise
      "Product_term": 50,
      "variant_code": "V01",
      "X-axis": {
      "age": 30 // age value
      },
      "Y-axis": {
      "PPT": 10 // premium per term value
      },
      "Premium_value": 30,
      "From":"from Date",
      "To": "To Date",
      "Sheet":"name of the sheet",   // storing name of the sheet.
      "TimeStamp":"Date()"    // for created date.
  },
  {
      "_id": 2,
      "rate_id": "c2",
      "product_code": "po1",
      "Gender": "M,F,T",
       "Tobacco": "Y",                   // Y if the individual uses tobacco, N otherwise
      "Product_term": 50,
      "variant_code": "V01",
      "X-axis": {
      "age": 30 // age value
      },
      "Y-axis": {
      "PPT": 10 // premium per term value
      },
      "Premium_value": 30,
      "From":"from Date",
      "To": "To Date",
      "Sheet":"name of the sheet",   // storing name of the sheet.
      "TimeStamp":"Date()"    // for created date.
  },
  {
      "_id": 3,
      "rate_id": "c3",
      "product_code": "po1",
      "Gender": "M,F,T",
       "Tobacco": "Y",                   // Y if the individual uses tobacco, N otherwise
      "Product_term": 50,
      "variant_code": "V01",
      "X-axis": {
      "age": 30 // age value
      },
      "Y-axis": {
      "PPT": 10 // premium per term value
      },
      "Premium_value": 30,
      "From":"from Date",
      "To": "To Date",
      "Sheet":"name of the sheet",   // storing name of the sheet.
      "TimeStamp":"Date()"    // for created date.
  },
  {
      "_id": 4,
      "rate_id": "c4",
      "product_code": "po1",
      "Gender": "M,F,T",
       "Tobacco": "Y",                   // Y if the individual uses tobacco, N otherwise
      "Product_term": 50,
      "variant_code": "V01",
      "X-axis": {
      "age": 30 // age value
      },
      "Y-axis": {
      "PPT": 10 // premium per term value
      },
      "Premium_value": 30,
      "From":"from Date",
      "To": "To Date",
      "Sheet":"mame of the sheet",   // storing name of the sheet.
      "TimeStamp":"Date()"    // for created date.
  }
]

const App = () => {
  const [fileArray, setFileArray] = useState([]);

  useEffect(() => {
    getAllData();
  },[])

  const getAllData = () => {
    setFileArray(dummyData);
  }

  return (
    <Card title="Excel upload and summary">
       <Row>
        <Col span={24}>
          <DynamicTable fileArray={fileArray} />
        </Col>
       </Row>
    </Card>
  )
}

export default App
