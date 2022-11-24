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
    productName: "",
    inventory: 0,
    replaceBy: "",
    price: 0,
    percentRemaining: 0,

    image: {},
    brand: "",
    group: "",
    store: "",
    url: "",
    notes: "",

    restock: true,
    threshold: 0,
  }

  const generateThreshold = (expiration, threshold) => {
    //option will be num days
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    expiration = Date.parse(expiration); //change expiration to ms
    threshold *= day;   //change threshold days to ms
    threshold = expiration - threshold; //subtract days in ms for threshold date

    let d = new Date(threshold);
    d = d.toDateString();

    return d.replace(/^\w{3}\s/, '');
  }

  const [type, setType] = useState('stockable')
  const [restock, setRestock] = useState(true)
  const [percent, setPercent] = useState(100);

  const handleSubmit = (values) => {

    const newValues = {
      ...defaultValues,
      ...values,
      inventory: values.inventory ? Number(values.inventory) : 0,
      price: values.price ? Number(values.price) : 0,
      type: type,
      restock: restock,
      percentRemaining: percent
    }

    if (!values.threshold && type === 'stockable') {
      newValues.threshold = 1
    } else if (!values.threshold && type === 'consumable') {
      newValues.threshold = 25
    } else if (!values.threshold && type === 'perishable'){
      newValues.threshold = generateThreshold(values.replaceBy, 7)
    } else {
      newValues.threshold = generateThreshold(values.replaceBy, values.threshold)
    }
    
    newValues.productName = values.productName[0].toUpperCase() + values.productName.substring(1,)
    if(values.brand) newValues.brand = values.brand[0].toUpperCase() + values.brand.substring(1,)
    if(values.group) newValues.group = values.group[0].toUpperCase() + values.group.substring(1,)
    if(values.store) newValues.store = values.store[0].toUpperCase() + values.store.substring(1,)
    if(values.notes) newValues.notes = values.notes[0].toUpperCase() + values.notes.substring(1,)


    //match date formats

    //Convert image to text

    //create post

    console.log(newValues);
  }


  const handleTypeChange = (e) => {
    setType(e.target.value)
    // if(e.target.value === 'stockable'){
    //   setThreshold(1)
    // } else if (e.target.value === 'consumable'){
    //   setThreshold(25)
    // } else {
    //   setThreshold(7)
    // }
  }

  const handleRestockChange = (e) => {
    setRestock(e.target.value)
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

          <Form.Item label='When do you want to restock?' >
            <Radio.Group name="type" defaultValue={type} onChange={handleTypeChange}>
              <Space direction="vertical">
                <Radio value={"stockable"} >When my shelf is almost empty</Radio>
                <Radio value={"consumable"} >When the container is running low</Radio>
                <Radio value={"perishable"} >Before a certain date</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="productName"
            label="Product name"
            rules={[{ required: true, message: "Give this product a name." }]} >
            <Input />
          </Form.Item>

          <Form.Item name='inventory'
            label="How many do you have?" >
            <Input type='number' min='0' defaultValue={0} />
          </Form.Item>

          <Form.Item name='replaceBy'
            label="Replace by?"
            rules={type === 'perishable' ? [{required: true, message: "Enter a date"}]: null}
            >
            <Input type='date' />
          </Form.Item>

          <Form.Item name='price'
            label="Price">
            <Input type='number' min='0' defaultValue={0} />
          </Form.Item>

          <Form.Item label='How much do you have left?'>
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
              <Form.Item label='Do you want to restock when you run out?' >
                <Radio.Group name='restock' defaultValue={true} onChange={handleRestockChange}>
                  <Radio value={true} >Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>

              {/* Thresholds */}
              {
                type && type === "stockable"
                  ? <><Form.Item name='threshold'
                    label='Remind me when I only have X units left' >
                    <Input key={1} type='number' min='0' defaultValue={1} />
                  </Form.Item></>
                  : type === "consumable"
                    ? <><Form.Item name='threshold'
                      label='Reming me when the container is at X%' >
                      <Input key={2} type='number' min='0' max='100' defaultValue={25} />
                    </Form.Item></>
                    : <> <Form.Item name='threshold'
                      label='Remind me X days before the replace by date' >
                      <Input key={3} type='number' defaultValue={7} />
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