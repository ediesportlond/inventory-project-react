import { useState } from 'react';
import {
  Modal, Form, Upload, Input,
  Radio, Space, Button, Progress, Collapse
} from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import '../assets/AddNew.css';

export default function AddNew({ setShowAddNew }) {

  const defaultValues = {
    type: "",
    inventory: 0, //chech for NaN
    productName: "",
    replaceBy: "2022-12-07",
    precentRemaining: 0,
    
    image: {},
    brand: "",
    price: 0,
    group: "",
    store: "",
    url: "",
    notes: "",

    restock: true, //check for undefined
    threshold: 0,  //check for NaN
  }

  const [type, setType] = useState('stockable')
  const [percent, setPercent] = useState(100);

  const handleSubmit = (values) => {
    const newValues = {
      ...values,
      inventory: Number(values.inventory),
      price: Number(values.price),
      threshold: Number(values.threshold),
      type: type,
      percentRamining: percent
    }

    //Capitalize productName
    //Add function for threshold to convert to a date
    //Convert image to text

    console.log(newValues);
  }


  const handleTypeChange = (e) => {
    setType(e.target.value)
  }

  const increase = () => {
    let newPercent = percent + 10;
    if (newPercent > 100) {
      newPercent = 100;
    }
    setPercent(newPercent);
  };
  const decline = () => {
    let newPercent = percent - 10;
    if (newPercent < 0) {
      newPercent = 0;
    }
    setPercent(newPercent);
  };

  const { Panel } = Collapse

  return (
    <>
      <Modal
        title="Add New Item"
        open={true}
        footer={null}
        onCancel={() => setShowAddNew(false)}>
        <Form onFinish={handleSubmit} layout='vertical'>

          <Form.Item label='When do you want to restock?' required >
            <Radio.Group name="type" defaultValue={type} onChange={handleTypeChange}>
              <Space direction="vertical">
                <Radio value={"stockable"} >When my shelf is almost empty</Radio>
                <Radio value={"consumable"}>When the container is running low</Radio>
                <Radio value={"perishable"}>Before a certain date</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item name='inventory'
            label="How many do you have?" required>
            <Input type='number' />
          </Form.Item>

          <Form.Item name="productName"
            label="Product name"
            required
          >
            <Input />
          </Form.Item>

          <Form.Item name='replaceBy'
            label="Replace by?">
            <Input type='date' />
          </Form.Item>

          <Form.Item label='How much do you have left?' required>
            <Progress
              type="circle"
              percent={percent}
              style={{
                marginRight: 8,
              }}
            />
            <Button.Group>
              <Button onClick={decline} icon={<MinusOutlined />} />
              <Button onClick={increase} icon={<PlusOutlined />} />
            </Button.Group>
          </Form.Item>

          {/* Additional Info */}
          <Collapse accordion>
            <Panel header="Additional Info" key="1">
              <Form.Item name="image" >
                <Upload listType="picture-card"
                  maxCount={1}>
                  Upload an Image
                </Upload>
              </Form.Item>

              <Form.Item name="brand"
                label="Brand"
              >
                <Input />
              </Form.Item>

              <Form.Item name='price'
                label="Price">
                <Input type='number' />
              </Form.Item>

              <Form.Item name="group"
                label="Group Label"
              >
                <Input />
              </Form.Item>

              <Form.Item name="store"
                label="Store"
              >
                <Input />
              </Form.Item>

              <Form.Item name="url"
                label="Link to buy"
              >
                <Input />
              </Form.Item>

              <Form.Item name="notes"
                label="Notes"
              >
                <Input />
              </Form.Item>
            </Panel>

            {/* Options */}
            <Panel header="Options" key="2">
              <Form.Item name='restock'
                label='Exclude from shopping list' >
                <Radio.Group name="type" defaultValue={'true'}>
                  <Radio value={'true'} >No</Radio>
                  <Radio value={'false'}>Yes</Radio>
                </Radio.Group>
              </Form.Item>

              {/* Thresholds */}
              {
                type && type === "stockable"
                  ? <><Form.Item name='threshold'
                    label='Remind me when I only have X units left'>
                    <Input type='number' min='0' defaultValue={1} />
                  </Form.Item></>
                  : type === "consumable"
                    ? <><Form.Item name='threshold'
                      label='Reming me when the container is at X%'>
                      <Input type='number' min='0' max='100' defaultValue={25} />
                    </Form.Item></>
                    : <> <Form.Item name='threshold'
                      label='Remind me X days before the replace by date'>
                      <Input type='number' defaultValue={7} />
                    </Form.Item></>
              }
            </Panel>
          </Collapse>

          <Form.Item className="save-form-btn"> <Input type='submit' value='Save' /> </Form.Item>
        </Form>

      </Modal>
    </>
  )
}