import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../App';
import Nav from '../components/Nav';
import {
  Form, Radio, Space, Input, Progress,
  Button, Collapse, Upload
} from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

// TODO: replaceBy date, display image, fetch when image uploaded, fetch with no image
//recognize changes when snitizing user input

export default function Update() {
  const { token } = useContext(UserContext);
  const { oid } = useParams();

  const convertFile = (file) => {
    if (file) {
      // const fileRef = files[0] || ""
      const fileType = file.type || ""
      const reader = new FileReader()
      reader.readAsBinaryString(file)
      reader.onload = (ev) => {
        // convert it to base64
        console.log({ ...values, image: `data:${fileType};base64,${window.btoa(ev.target.result)}` })
        // fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/update/:oid`, {
        //   method: "POST",
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': token
        //   },
        //   body: JSON.stringify({ ...values, image: `data:${fileType};base64,${window.btoa(ev.target.result)}` })
        // })
        //   .then((res) => {
        //     alert('Item updated succesfully.')
        //   })
        //   .catch(console.error)
      }
    }
  };

  const generateThreshold = (expiration, threshold) => {
    //option will be num days
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    expiration = Date.parse(expiration); //change expiration to ms
    threshold *= day;  //change threshold days to ms
    threshold = expiration - threshold; //subtract days in ms for threshold date

    let d = new Date(threshold);
    d = d.toDateString();

    return d.replace(/^\w{3}\s/, '');
  };

  const [values, setValues] = useState({
    type: "stockable",
    productName: "Sample Product",
    inventory: 5,
    replaceBy: "JAN 1 2023",
    price: 3.50,
    percentRemaining: 80,

    image: "",
    brand: "Some Brand",
    group: "Group 1",
    store: "Yes",
    url: "google.com",
    notes: "Some notes about this",
    sku: "12345",

    restock: true,
    threshold: 3,
  })
  const [percent, setPercent] = useState(values.percentRemaining || 100);

  const handleSubmit = (val) => {
    setValues({
      ...values,
      inventory: Number(values.inventory),
      price: Number(values.price),
      percentRemaining: percent
    })

    if (values.type === 'stockable' && !values.threshold) {
      values.threshold = 1;
    } else if (values.type === 'consumable' && !values.threshold) {
      values.threshold = 25;
    } else if (values.type === 'perishable' && !values.threshold) {
      values.threshold = generateThreshold(values.replaceBy, 7);
    } else if (values.type === 'perishable') {
      values.threshold = generateThreshold(values.replaceBy, values.threshold);
    } else {
      values.threshold = Number(values.threshold);
    }

    if (values.productName) values.productName = values.productName[0].toUpperCase() + values.productName.substring(1,)
    if (values.replaceBy) values.replaceBy = new Date(values.replaceBy).toDateString().replace(/^\w{3}\s/, '')
    if (values.brand) values.brand = values.brand[0].toUpperCase() + values.brand.substring(1,)
    if (values.group) values.group = values.group[0].toUpperCase() + values.group.substring(1,)
    if (values.store) values.store = values.store[0].toUpperCase() + values.store.substring(1,)
    if (values.notes) values.notes = values.notes[0].toUpperCase() + values.notes.substring(1,)

    if (val.image && val.image.file) {
      convertFile(val.image.file.originFileObj)
    } else {
      console.log(values)
    }
  };

  const handleTypeChange = (e) => {
    if (e.target.value === 'stockable' && values.type !== e.target.value ) {
      setValues({ ...values, type: e.target.value, threshold: 1 })
    } else if (e.target.value === 'consumable' && values.type !== e.target.value) {
      setValues({ ...values, type: e.target.value, threshold: 25 })
    } else {
      setValues({ ...values, type: e.target.value, threshold: 7 })
    }
  };

  const increase = () => {
    let newPercent = percent + 10;
    if (newPercent > 100) {
      newPercent = 100;
    }
    setPercent(newPercent);
    setValues({ ...values, percentRemaining: newPercent })
  };

  const decline = () => {
    let newPercent = percent - 10;
    if (newPercent < 0) {
      newPercent = 0;
    }
    setPercent(newPercent);
    setValues({ ...values, percentRemaining: newPercent })
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/single/${oid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res.message === 'object'){
          setValues(res.message)
        } else {
          alert('Server did not respond. Please try again.')
        }
      })
      .catch(console.error)
  }, [oid, token])

  const { Panel } = Collapse

  return (
    <>
      <Nav />
      <section style={{ margin: '1rem 2rem 1rem 2rem' }}>
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
            label="Product name" >
            <Input defaultValue={values.productName}
            onChange={(e) => setValues({ ...values, productName: e.target.value })} />
          </Form.Item>

          <Form.Item name='inventory'
            label="How many do you have?" >
            <Input defaultValue={values.inventory}
            type='number' min='0'
              onChange={(e) => setValues({ ...values, inventory: e.target.value })} />
          </Form.Item>

          <Form.Item name='replaceBy'
            label="Replace by?"
            rules={values.type === 'perishable' ? [{ required: true, message: "Enter a date" }] : null}
          >
            <Input 
            type='date' onChange={(e) => setValues({ ...values, replaceBy: e.target.value })} />
          </Form.Item>

          <Form.Item name='price'
            label="Price">
            <Input defaultValue={values.price}
            type='number' min='0' step='.01' placeholder={0} 
            onChange={(e) => setValues({ ...values, price: e.target.value })} />
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
                  maxCount={1} >
                  Upload an Image
                </Upload>
              </Form.Item>

              <Form.Item name="brand"
                label="Brand"
              >
                <Input defaultValue={values.brand}
                onChange={(e) => setValues({ ...values, brand: e.target.value })} />
              </Form.Item>

              <Form.Item name="group"
                label="Group Label"
              >
                <Input defaultValue={values.group}
                onChange={(e) => setValues({ ...values, group: e.target.value })} />
              </Form.Item>

              <Form.Item name="store"
                label="Store"
              >
                <Input defaultValue={values.store}
                 onChange={(e) => setValues({ ...values, store: e.target.value })} />
              </Form.Item>

              <Form.Item name="url"
                label="Link to buy"
              >
                <Input defaultValue={values.url}
                onChange={(e) => setValues({ ...values, url: e.target.value })} />
              </Form.Item>

              <Form.Item name="notes"
                label="Notes"
              >
                <Input defaultValue={values.notes}
                onChange={(e) => setValues({ ...values, notes: e.target.value })} />
              </Form.Item>

              <Form.Item name="sku"
                label="SKU"
              >
                <Input defaultValue={values.sku}
                onChange={(e) => setValues({ ...values, sku: e.target.value })} />
              </Form.Item>
            </Panel>

            {/* Options */}
            <Panel header="Options" key="2">
              <Form.Item label='Do you want to restock when you run out?' >
                <Radio.Group name='restock' defaultValue={values.restock}
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
              <Input name='treshold' 
              min='0' type='number' onChange={e => setValues({ ...values, threshold: e.target.value })}
                placeholder={values.threshold} />
            </Panel>
          </Collapse>

          <Form.Item className="save-form-btn"> <Input type='submit' value='Save' /> </Form.Item>
        </Form>
      </section>
    </>
  )
}