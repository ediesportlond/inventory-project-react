import { useState } from 'react';
import {
  Modal, Form, Upload, Input,
  Radio, Space, Button, Progress, Collapse
} from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import '../assets/AddNew.css';

export default function AddNew({ setShowAddNew }) {

  const defaultValues = {
    type: "stockable",
    productName: "",
    inventory: 0,
    replaceBy: "",
    price: 0,
    percentRemaining: 100,

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

  const [values, setValues] = useState(defaultValues)
  const [percent, setPercent] = useState(100);

  const handleSubmit = () => {
    setValues({
      ...values,
      inventory: Number(values.inventory),
      price: Number(values.price),
      percentRemaining: percent
    })

    if (values.type === 'stockable') {
      values.threshold = 1
    } else if (values.type === 'consumable') {
      values.threshold = 25
    } else if (values.type === 'perishable'){
      values.threshold = generateThreshold(values.replaceBy, 7)
    } else {
      values.threshold = generateThreshold(values.replaceBy, values.threshold)
    }
    
    values.productName = values.productName[0].toUpperCase() + values.productName.substring(1,)
    if(values.brand) values.brand = values.brand[0].toUpperCase() + values.brand.substring(1,)
    if(values.group) values.group = values.group[0].toUpperCase() + values.group.substring(1,)
    if(values.store) values.store = values.store[0].toUpperCase() + values.store.substring(1,)
    if(values.notes) values.notes = values.notes[0].toUpperCase() + values.notes.substring(1,)


    //match date formats
    //fix upload
    //control state on additional info
    //Convert image to text

    //create post

    console.log(values);
  }

  const handleTypeChange = (e) => {
    
    if(e.target.value == 'stockable'){
      setValues({...values, type: e.target.value, threshold: 1})
    } else if (e.target.value == 'consumable' ){
      setValues({...values, type: e.target.value, threshold: 25})
    } else {
      setValues({...values, type: e.target.value, threshold: 7})
    }

  }
  const increase = () => {
    let newPercent = percent + 10;
    if (newPercent > 100) {
      newPercent = 100;
    }
    setPercent(newPercent);
    setValues({...values, percentRemaining: newPercent})
  };
  const decline = () => {
    let newPercent = percent - 10;
    if (newPercent < 0) {
      newPercent = 0;
    }
    setPercent(newPercent);
    setValues({...values, percentRemaining: newPercent})
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
            <Radio.Group name="type" defaultValue={values.type} onChange={handleTypeChange} >
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
            <Input onChange={(e) => setValues({...values, productName: e.target.value})} />
          </Form.Item>

          <Form.Item name='inventory'
            label="How many do you have?" >
            <Input type='number' min='0' placeholder={values.inventory} 
            onChange={(e) => setValues({...values, inventory: e.target.value})}/>
          </Form.Item>

          <Form.Item name='replaceBy'
            label="Replace by?"
            rules={values.type === 'perishable' ? [{required: true, message: "Enter a date"}]: null}
            >
            <Input type='date' onChange={(e) => setValues({...values, date: e.target.value})}/>
          </Form.Item>

          <Form.Item name='price'
            label="Price">
            <Input type='number' min='0' placeholder={0}  onChange={(e) => setValues({...values, price: e.target.value})}/>
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
                <Radio.Group name='restock' defaultValue={true} 
                onChange={(e) => setValues({...values, restock: e.target.value})}>
                  <Radio value={true} >Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>

              {/* Thresholds */}
              {
                values && values.type === "stockable"
                  ? <><Form.Item name='threshold'
                    label='Remind me when I only have X units left' >
                    <Input key={1} type='number' min='0' placeholder={1} onChange={(e) => setValues({...values, threshold: e.target.value})}/>
                  </Form.Item></>
                  : values.type === "consumable"
                    ? <><Form.Item name='threshold'
                      label='Reming me when the container is at X%' >
                      <Input key={2} type='number' min='0' max='100' placeholder={25} onChange={(e) => setValues({...values, threshold: e.target.value})} />
                    </Form.Item></>
                    : <> <Form.Item name='threshold'
                      label='Remind me X days before the replace by date' >
                      <Input key={3} type='number' placeholder={7} onChange={(e) => setValues({...values, threshold: e.target.value})}/>
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