import { useState, useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import {
  Form, Radio, Space, Input, Progress,
  Button, Collapse, Upload
} from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import '../assets/update.css';

export default function Update() {
  const { token } = useContext(UserContext);
  const { oid } = useParams();

  const [values, setValues] = useState();
  const [updateValues, setUpdateValues] = useState();
  const [percent, setPercent] = useState(100);

  const navigate = useNavigate();

  const convertFile = (file) => {
    if (file) {
      // const fileRef = files[0] || ""
      const fileType = file.type || ""
      const reader = new FileReader()
      reader.readAsBinaryString(file)
      reader.onload = (ev) => {
        // convert it to base64
        fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/update/${oid}`, {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({ ...updateValues, image: `data:${fileType};base64,${window.btoa(ev.target.result)}` })
        })
          .then((res) => {
            navigate('/')
          })
          .catch(console.error)
      }
    }
  };

  const generateThreshold = (expiration, threshold) => {
    //option will be num days
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    if (isNaN(threshold)) {
      threshold = Date.parse(values?.replaceBy + ' ') - Date.parse(threshold + ' ')

    } else {
      threshold *= day;  //change threshold days to ms
    }

    expiration = Date.parse(expiration + ' '); //change expiration to ms
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

    return `${year}-${month}-${_day}`

  };

  const handleSubmit = (val) => {
    if (!updateValues && !val?.image) return;

    setUpdateValues({ ...updateValues, percentRemaining: percent })

    let type, threshold;
    if (updateValues?.threshold && updateValues.type) {
      type = updateValues.type;
      threshold = updateValues.threshold;
    } else if (updateValues?.threshold) {
      type = values.type;
      threshold = updateValues.threshold;
    }

    if (type && threshold) {
      if (type !== 'perishable') {
        updateValues.threshold = Number(updateValues.threshold);
      } else if (updateValues?.replaceBy && !isNaN(updateValues.threshold)) {
        updateValues.threshold = generateThreshold(updateValues.replaceBy, updateValues.threshold);
      } else {
        updateValues.threshold = generateThreshold(values.replaceBy, updateValues.threshold);
      }
    }

    if (updateValues?.productName) updateValues.productName = updateValues.productName[0].toUpperCase() + updateValues.productName.substring(1,)
    if (updateValues?.replaceBy) updateValues.replaceBy = new Date(updateValues.replaceBy + ' ').toDateString().replace(/^\w{3}\s/, '')
    if (updateValues?.brand) updateValues.brand = updateValues.brand[0].toUpperCase() + updateValues.brand.substring(1,)
    if (updateValues?.group) updateValues.group = updateValues.group[0].toUpperCase() + updateValues.group.substring(1,)
    if (updateValues?.store) updateValues.store = updateValues.store[0].toUpperCase() + updateValues.store.substring(1,)
    if (updateValues?.notes) updateValues.notes = updateValues.notes[0].toUpperCase() + updateValues.notes.substring(1,)

    if (val.image && val.image.file) {
      convertFile(val.image.file.originFileObj);
    } else {
      fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/update/${oid}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(updateValues)
      })
        .then(() => navigate('/'))
        .catch(console.error);
    };
  };

  const handleTypeChange = (e) => {
    if (e.target.value === 'stockable' && values.type !== e.target.value) {
      setValues({ ...values, type: e.target.value, threshold: 1 })
      setUpdateValues({ ...updateValues, type: e.target.value, threshold: 1 })
    } else if (e.target.value === 'consumable' && values.type !== e.target.value) {
      setValues({ ...values, type: e.target.value, threshold: 25 })
      setUpdateValues({ ...updateValues, type: e.target.value, threshold: 25 })
    } else {
      setValues({ ...values, type: e.target.value, threshold: 7 })
      setUpdateValues({ ...updateValues, type: e.target.value, threshold: 7 })
    }
  };

  const increase = () => {
    let newPercent = percent + 5;
    if (newPercent > 100) {
      newPercent = 100;
    }
    setPercent(newPercent);
    setUpdateValues({ ...updateValues, percentRemaining: newPercent })
  };

  const decline = () => {
    let newPercent = percent - 5;
    if (newPercent < 0) {
      newPercent = 0;
    }
    setPercent(newPercent);
    setUpdateValues({ ...updateValues, percentRemaining: newPercent });
  };

  const handleDateChange = (e) => {

    if (updateValues?.type && updateValues.type === 'perishable') {

      const newThreshold = generateThreshold(e.target.value, updateValues.threshold);
      setUpdateValues({ ...updateValues, threshold: newThreshold, replaceBy: e.target.value });
      return;

    } else if (values?.type === 'perishable' && updateValues?.threshold) {

      const newThreshold = generateThreshold(e.target.value, updateValues.threshold)
      setUpdateValues({ ...updateValues, threshold: newThreshold, replaceBy: e.target.value });
      return;

    } else if (values?.type === 'perishable') {

      const newThreshold = generateThreshold(e.target.value, values.threshold);
      setUpdateValues({ ...updateValues, threshold: newThreshold, replaceBy: e.target.value });
      return;

    }
    setUpdateValues({ ...updateValues, replaceBy: e.target.value });
  }

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
        if (typeof res.message === 'object') {
          if (res.message.replaceBy) {
            const months = {
              Jan: '01', Feb: '02', Mar: '03', Apr: '04',
              May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10',
              Nov: '11', Dec: '12'
            }

            const date = res.message.replaceBy;
            const month = months[date.match(/^\w{3}/)];
            const nums = date.match(/\d+/g);
            let day = nums[0];
            let year = nums[1];
            if (day.length < 2) day = '0' + day;
            setValues({ ...res.message, replaceBy: `${year}-${month}-${day}` })
            setPercent(res.message.percentRemaining);
          } else {
            setValues(res.message)
            setPercent(res.message.percentRemaining);
          }
        } else {
          console.error('Server did not respond. Please try again.')
        }
      })
      .catch(console.error)
  }, [oid, token, setValues])

  const { Panel } = Collapse

  return (
    <>
      <nav>
        <Link to='/' >&larr; Go Back</Link>
      </nav>
      <div className='product-name-conatiner'>
        <h1>{values?.productName}</h1>
      </div>
      <div className="product-image-container">
        {
          values && values.image
            ? <img className='product-image' src={values.image} alt={values.productName} />
            : null
        }
      </div>
      {
        values
          ?
          <Form className='update-form' onFinish={handleSubmit} layout='vertical'>

            <Form.Item label='When do you want to restock?' >
              <Radio.Group name="type" defaultValue={values?.type} onChange={handleTypeChange} >
                <Space direction="vertical">
                  <Radio value={"stockable"} >When my shelf is almost empty</Radio>
                  <Radio value={"consumable"} >When the container is running low</Radio>
                  <Radio value={"perishable"} >Before a certain date</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="productName"
              label="Product name" >
              <Input defaultValue={values?.productName}
                onChange={(e) => setUpdateValues({ ...updateValues, productName: e.target.value })} />
            </Form.Item>

            <Form.Item name='inventory'
              label="How many do you have?" >
              <Input defaultValue={values?.inventory}
                type='number' min='0'
                onChange={(e) => setUpdateValues({ ...updateValues, inventory: Number(e.target.value) })} />
            </Form.Item>

            <label htmlFor='replaceBy'>Replace by this date</label><br />
            <input value={updateValues?.replaceBy || values?.replaceBy} name='replaceBy'
              required={values?.type === 'perishable' ? true : false}
              type='date' onChange={handleDateChange} />
            <br /><br />

            <Form.Item name='price'
              label="Price">
              <Input defaultValue={values?.price}
                type='number' min='0' step='.01' placeholder={0}
                onChange={(e) => setUpdateValues({ ...updateValues, price: Number(e.target.value) })} />
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
                  label="Brand" >
                  <Input defaultValue={values?.brand}
                    onChange={(e) => setUpdateValues({ ...updateValues, brand: e.target.value })} />
                </Form.Item>

                <Form.Item name="group"
                  label="Group Label" >
                  <Input defaultValue={values?.group}
                    onChange={(e) => setUpdateValues({ ...updateValues, group: e.target.value })} />
                </Form.Item>

                <Form.Item name="store"
                  label="Store" >
                  <Input defaultValue={values?.store}
                    onChange={(e) => setUpdateValues({ ...updateValues, store: e.target.value })} />
                </Form.Item>

                <Form.Item name="url"
                  label="Link to buy" >
                  <Input defaultValue={values?.url}
                    onChange={(e) => setUpdateValues({ ...updateValues, url: e.target.value })} />
                </Form.Item>

                <Form.Item name="notes"
                  label="Notes" >
                  <Input defaultValue={values?.notes}
                    onChange={(e) => setUpdateValues({ ...updateValues, notes: e.target.value })} />
                </Form.Item>

                <Form.Item name="sku"
                  label="SKU" >
                  <Input defaultValue={values?.sku}
                    onChange={(e) => setUpdateValues({ ...updateValues, sku: e.target.value })} />
                </Form.Item>
              </Panel>

              {/* Options */}
              <Panel header="Options" key="2">
                <Form.Item label='Do you want to restock when you run out?' >
                  <Radio.Group name='restock' defaultValue={values?.restock}
                    onChange={(e) => setUpdateValues({ ...updateValues, restock: e.target.value })}>
                    <Radio value={true} >Yes</Radio>
                    <Radio value={false}>No</Radio>
                  </Radio.Group>
                </Form.Item>

                {/* Thresholds */}
                <label htmlFor='threshold'>{
                  values?.type === 'stockable'
                    ? 'Remind me when I only have X units left'
                    : values?.type === 'consumable'
                      ? 'Reming me when the container is at X%'
                      : 'Remind me X days before the replace by date'
                }</label>
                <Input name='treshold'
                  min='0' type='number' onChange={e => setUpdateValues({ ...updateValues, threshold: Number(e.target.value) })}
                  placeholder={updateValues?.threshold || values.threshold} />
              </Panel>
            </Collapse>

            <Form.Item className="save-form-btn"> <Input type='submit' value='Save' /> </Form.Item>
          </Form>
          : <p>⏱ Loading ... ⏱</p>

      }
    </>
  )
}