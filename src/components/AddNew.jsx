import { useState, useContext } from 'react';
import { UserContext } from '../App';
import {
  Modal, Form, Upload, Input,
  Radio, Space, Button, Progress, Collapse
} from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import '../assets/AddNew.css';

export default function AddNew({ setShowAddNew, setList }) {
  const { token } = useContext(UserContext);

  const defaultValues = {
    type: "stockable",
    productName: "",
    inventory: 0,
    replaceBy: "",
    price: 0,
    percentRemaining: 100,

    image: "",
    brand: "",
    group: "",
    store: "",
    url: "",
    notes: "",
    sku: "",

    restock: true,
    threshold: 0,
  };

  const convertFile = (file) => {
    if (file) {
      // const fileRef = files[0] || ""
      const fileType = file.type || "";
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (ev) => {
        // convert it to base64
        fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/new`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({ ...values, image: `data:${fileType};base64,${window.btoa(ev.target.result)}` })
        })
          .then(res => res.json())
          .then((res) => {
            setList(res.message);
            setShowAddNew(false);
          })
          .catch(console.error);
      }
    }
  };

  const generateThreshold = (expiration, threshold) => {
    //option will be num days
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
  
    if (isNaN(threshold)) {
      threshold = Date.parse(expiration) - Date.parse(threshold);
    } else {
      threshold *= day;  //change threshold days to ms
    }
    expiration = Date.parse(expiration); //change expiration to ms
    expiration += day;

    threshold = expiration - threshold; //subtract days in ms for threshold date
    let d = new Date(threshold);
    d = d.toDateString();
    d = d.replace(/^\w{3}\s/, '');

    const months = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04',
      May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10',
      Nov: '11', Dec: '12'
    }

    const month = months[d.match(/^\w{3}/)];
    const nums = d.match(/\d+/g); 
    let _day = nums[0];
    let year = nums[1];
    if (_day.length < 2) _day = '0' + _day;
    return `${year}-${month}-${_day}`;
  };

  const [values, setValues] = useState(defaultValues);
  const [percent, setPercent] = useState(100);

  const handleSubmit = (val) => {

    if (values.type === 'stockable' && !values.threshold) {
      values.threshold = 1;
    } else if (values.type === 'consumable' && !values.threshold) {
      values.threshold = 25;
    } else if (values.type === 'perishable' && !values.threshold) {
      values.threshold = generateThreshold(values.replaceBy, 7);
    } else if (values.type === 'perishable') {
      values.threshold = generateThreshold(values.replaceBy, values.threshold);
    }
    values.productName = values.productName[0].toUpperCase() + values.productName.substring(1,);

    if (values.replaceBy) values.replaceBy = new Date(Date.parse(values.replaceBy)+ +18000000).toDateString().replace(/^\w{3}\s/, '');
    if (values.brand) values.brand = values.brand[0].toUpperCase() + values.brand.substring(1,);
    if (values.group) values.group = values.group[0].toUpperCase() + values.group.substring(1,);
    if (values.store) values.store = values.store[0].toUpperCase() + values.store.substring(1,);
    if (values.notes) values.notes = values.notes[0].toUpperCase() + values.notes.substring(1,);

    if (val.image && val.image.file) {
      convertFile(val.image.file.originFileObj);
    } else {
      fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/new`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(values)
      })
        .then(res => res.json())
        .then((res) => {
          setList(res.message);
          setShowAddNew(false);
        })
        .catch(console.error);
    }

  };

  const handleTypeChange = (e) => {

    if (e.target.value === 'stockable') {
      setValues({ ...values, type: e.target.value, threshold: 1 });
    } else if (e.target.value === 'consumable') {
      setValues({ ...values, type: e.target.value, threshold: 25 });
    } else {
      setValues({ ...values, type: e.target.value, threshold: 7 });
    }

  };

  const increase = () => {
    let newPercent = percent + 5;
    if (newPercent > 100) {
      newPercent = 100;
    }
    setPercent(newPercent);
    setValues({ ...values, percentRemaining: newPercent });
  };

  const decline = () => {
    let newPercent = percent - 5;
    if (newPercent < 0) {
      newPercent = 0;
    }
    setPercent(newPercent);
    setValues({ ...values, percentRemaining: newPercent });
  };

  const { Panel } = Collapse;

  return (
    <>
      <Modal
        className='add-new-modal'
        title="Add New Item"
        open={true}
        footer={null}
        onCancel={() => setShowAddNew(false)}>
        <Form onFinish={handleSubmit} layout='vertical'>

          <Form.Item label='When do you want to restock?' >
            <Radio.Group name="type" defaultValue={values.type} onChange={handleTypeChange} 
            className='type-selector-container'>
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
            <Input onChange={(e) => setValues({ ...values, productName: e.target.value.replace(/\s*$/, '') })} />
          </Form.Item>

          <Form.Item name='inventory'
            label="How many do you have?" >
            <Input type='number' min='0' placeholder={values.inventory}
              onChange={(e) => setValues({ ...values, inventory: Number(e.target.value) })} />
          </Form.Item>

          <Form.Item name='replaceBy'
            label="Replace by?"
            rules={values.type === 'perishable' ? [{ required: true, message: "Enter a date" }] : null}
          >
            <Input type='date' onChange={(e) => setValues({ ...values, replaceBy: e.target.value })} />
          </Form.Item>

          <Form.Item name='price'
            label="Price">
            <Input type='number' min='0' step='.01' placeholder={0}
              onChange={(e) => setValues({ ...values, price: Number(e.target.value) })} />
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
                accept='image'
                  maxCount={1} >
                  Upload an Image
                </Upload>
              </Form.Item>

              <Form.Item name="brand"
                label="Brand"
              >
                <Input onChange={(e) => setValues({ ...values, brand: e.target.value.replace(/\s*$/, '') })} />
              </Form.Item>

              <Form.Item name="group"
                label="Group Label"
              >
                <Input onChange={(e) => setValues({ ...values, group: e.target.value.replace(/\s*$/, '') })} />
              </Form.Item>

              <Form.Item name="store"
                label="Store"
              >
                <Input onChange={(e) => setValues({ ...values, store: e.target.value.replace(/\s*$/, '') })} />
              </Form.Item>

              <Form.Item name="url"
                label="Link to buy"
              >
                <Input onChange={(e) => setValues({ ...values, url: e.target.value.replace(/\s*$/, '') })} />
              </Form.Item>

              <Form.Item name="notes"
                label="Notes"
              >
                <Input onChange={(e) => setValues({ ...values, notes: e.target.value.replace(/\s*$/, '') })} />
              </Form.Item>

              <Form.Item name="sku"
                label="SKU"
              >
                <Input onChange={(e) => setValues({ ...values, sku: e.target.value.replace(/\s*$/, '') })} />
              </Form.Item>
            </Panel>

            {/* Options */}
            <Panel header="Options" key="2">
              <Form.Item label='Do you want to restock when you run out?' >
                <Radio.Group name='restock' defaultValue={true}
                  onChange={(e) => setValues({ ...values, restock: e.target.value })}>
                  <Radio value={true} >Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>

              {/* Thresholds */}
              <label htmlFor='threshold'>{
                values.type === 'stockable'
                  ? 'Remind me when I only have X units left'
                  : values.type === 'consumable'
                    ? 'Reming me when the container is at X%'
                    : 'Remind me X days before the replace by date'
              }</label>
              <Input name='treshold' type='number' onChange={e => setValues({ ...values, threshold: Number(e.target.value) })}
                placeholder={
                  values.type === 'stockable'
                    ? '1'
                    : values.type === 'consumable'
                      ? '25'
                      : '7'
                } />

            </Panel>
          </Collapse>

          <Form.Item className="save-form-btn"> <Input type='submit' value='Save' /> </Form.Item>
        </Form>

      </Modal>
    </>
  )
}