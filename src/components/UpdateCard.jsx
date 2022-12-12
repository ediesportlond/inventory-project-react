import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import defaultImg from '../scenes/default-img.webp';
import { Card, Avatar, Button, Input, Alert } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import '../assets/updateCard.css';

export default function UpdateCard({ item, refresh, setRefresh }) {
  const { token, setUser, setToken } = useContext(UserContext);
  const [values, setValues] = useState({ inventory: item['inventory'], percentRemaining: item['percentRemaining'] });
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState();

  const handleClose = () => {
    setVisible(false);
  };

  const handleUpdate = () => {
    fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/update/${item._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(values)
    })
      .then(res => {
        if (res.status === 401) {
          setUser();
          setToken();
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
        }
        return res.json();
      })
      .then(() => {
        setMessage(`${item.productName} has been updated.`)
        setVisible(true)
      })
      .catch(console.error);
  }

  const generateThreshold = (expiration, threshold) => {
    // option will be num days
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    if (isNaN(threshold)) {
      threshold = Date.parse(item?.replaceBy + ' ') - Date.parse(threshold + ' ');

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

    return `${year}-${month}-${_day}`;

  };

  const handleDateChange = ({ target: { value } }) => {

    if (item.type === 'perishable') {

      const newThreshold = generateThreshold(value, item.threshold);

      const newDate = new Date(value + ' ').toDateString().replace(/^\w{3}\s/, '');
      fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/update/${item._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ replaceBy: newDate, threshold: newThreshold })
      })
        .then(res => {
          if (res.status === 401) {
            setUser();
            setToken();
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
          }
          return res.json();
        })
        .then(() => setRefresh(!refresh))
        .catch(console.error);
    } else {

      const newDate = new Date(value + ' ').toDateString().replace(/^\w{3}\s/, '');
      fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/update/${item._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ replaceBy: newDate })
      })
        .then(res => {
          if (res.status === 401) {
            setUser();
            setToken();
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
          }
          return res.json();
        })
        .then(() => setRefresh(!refresh))
        .catch(console.error);
    }


  }

  const handlePriceChange = ({ target: { value } }) => {
    fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/update/${item._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ price: Number(value) })
    })
      .then(res => {
        if (res.status === 401) {
          setUser();
          setToken();
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
        }
        return res.json();
      })
      .then(() => setRefresh(!refresh))
      .catch(console.error);
  }

  const deleteItem = (id, productName) => {
    const confirmation = window.confirm(`Are you sure you want to delete ${productName}`);

    if (!confirmation) return;

    fetch(`${process.env.REACT_APP_ENDPOINT}/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    })
      .then(res => {
        if (res.status === 401) {
          setUser();
          setToken();
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
        }
        return res.json();
      })
      .then(() => setRefresh(!refresh))
      .catch(console.error);
  }

  return (
    <>
      <Card className='update-card' title={<Link to={`/update/${item._id}`}><EditOutlined /> {item.productName + (item.brand ? ' - ' + item.brand : '')}</Link>}
        hoverable
        extra={<Avatar src={item.image || defaultImg} />} >
        <>
          {visible && (
            <Alert message={message} type="success" closable afterClose={handleClose} />
          )}
          <div className='update-card-body' >

            <div className='row' >
              <div className='column start'>
                <p>In Stock:</p>
              </div>
              <div className='column'>
                <p>{values?.inventory}</p>
              </div>
              <div className='column end' style={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                <div className='button-container'>
                  <Button onClick={() => values.inventory > 0 && setValues({ ...values, inventory: values.inventory - 1 })}>➖</Button>
                  <Button onClick={() => setValues({ ...values, inventory: values.inventory + 1 })}>➕</Button>
                </div>
              </div>
            </div>

            <div className='row' >
              <div className='column start'>
                <p>Remaining:</p>
              </div>
              <div className='column'>
                <p>{values?.percentRemaining}%</p>
              </div>
              <div className='column end'>
                <div className='button-container'>
                  <Button onClick={() => values.percentRemaining > 0 && setValues({ ...values, percentRemaining: values.percentRemaining - 5 })}>➖</Button>
                  <Button onClick={() => setValues({ ...values, percentRemaining: 100 })}>➕</Button>
                </div>
              </div>
            </div>

            <div className='row' >

              <div className='column start'>
                <p>Replace By:</p>
              </div>
              <div className='column'>
                <p>{item?.replaceBy}</p>
              </div>
              <div className='column end'>
                <Input className='update-card-input' type='date' defaultValue={item?.replaceBy && generateThreshold(item.replaceBy, 0)} onChange={handleDateChange} />
              </div>
            </div>

            <div className='row' >

              <div className='column start'>
                <p>Price:</p>
              </div>
              <div className='column'>
                <p>{!isNaN(item?.price) && `$${Number(item?.price).toFixed(2)}`}</p>
              </div>
              <div className='column end'>
                <Input className='update-card-input' type='number' min='0' step='.01' placeholder={!isNaN(item?.price) && `${Number(item?.price).toFixed(2)}`} onChange={handlePriceChange} />
              </div>
            </div>

            <div className='delete-container'>
              <Button type='text' onClick={(e) => {
                e.preventDefault();
                handleUpdate();
              }}>
                Save</Button>
              <Button type='text' onClick={(e) => {
                e.preventDefault();
                deleteItem(item._id, item.productName)
              }}>
                Delete</Button>
            </div>

          </div>
        </>
      </Card>
    </>
  )
}