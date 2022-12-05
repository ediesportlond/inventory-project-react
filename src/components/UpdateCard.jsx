import { useContext } from 'react';
import {Link} from 'react-router-dom';
import { UserContext } from '../App';
import { Card, Avatar, Button, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import '../assets/updateCard.css';

export default function UpdateCard({ item, refresh, setRefresh }) {
  const { token, setUser, setToken } = useContext(UserContext);

  const increaseInventory = () => {

    fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/update/${item._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ inventory: item.inventory + 1 })
    })
      .then(res => {
        if (res.status === 401) {
          setUser()
          setToken()
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
        return res.json()
      })
      .then(() => setRefresh(!refresh))

    // setInventory(inventory + 1);
  }

  const decreaseInventory = () => {
    if (item.inventory > 0) {
      fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/update/${item._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ inventory: item.inventory - 1 })
      })
        .then(res => {
          if (res.status === 401) {
            setUser()
            setToken()
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
          }
          return res.json()
        })
        .then(() => setRefresh(!refresh))

      // setInventory(inventory - 1);
    }
  }

  const increasePercent = () => {

    if (item.percentRemaining < 100) {

      fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/update/${item._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ percentRemaining: 100 })
      })
        .then(res => {
          if (res.status === 401) {
            setUser()
            setToken()
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
          }
          return res.json()
        })
        .then(() => setRefresh(!refresh))

      // setPercent(percent + 5);
    }
  }

  const decreasePercent = () => {
    if (item.percentRemaining > 0) {
      fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/update/${item._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ percentRemaining: item.percentRemaining - 5 })
      })
        .then(res => {
          if (res.status === 401) {
            setUser()
            setToken()
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
          }
          return res.json()
        })
        .then(() => setRefresh(!refresh))

      // setPercent(percent - 5);
    }
  }

  const generateThreshold = (expiration, threshold) => {
    // option will be num days
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    if (isNaN(threshold)) {
      threshold = Date.parse(item?.replaceBy + ' ') - Date.parse(threshold + ' ')

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

  const handleDateChange = ({ target: { value } }) => {

    if (item.type === 'perishable') {

      const newThreshold = generateThreshold(value, item.threshold);

      const newDate = new Date(value + ' ').toDateString().replace(/^\w{3}\s/, '')
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
            setUser()
            setToken()
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
          }
          return res.json()
        })
        .then(() => setRefresh(!refresh))
      // setDate(newDate);

    } else {

      const newDate = new Date(value + ' ').toDateString().replace(/^\w{3}\s/, '')
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
            setUser()
            setToken()
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
          }
          return res.json()
        })
        .then(() => setRefresh(!refresh))
      // setDate(newDate);
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
          setUser()
          setToken()
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
        return res.json()
      })
      .then(() => setRefresh(!refresh))
      .catch(console.error);

    // setPrice(value);

  }

  return (
    <>
      <Card className='update-card' title={<Link to={`/update/${item._id}`}><EditOutlined /> {item.productName + (item.brand ? ' - ' + item.brand : '')}</Link>}
        hoverable
        extra={<Avatar src={item.image || 'https://placekitten.com/100/100'} />} >
        <>
          <div className='update-card-body' >

            <div className='row' >
              <div className='column start'>
                <p>In Stock:</p>
              </div>
              <div className='column'>
                <p>{item.inventory}</p>
              </div>
              <div className='column end' style={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                <div className='button-container'>
                  <Button onClick={decreaseInventory}>➖</Button>
                  <Button onClick={increaseInventory}>➕</Button>
                </div>
              </div>
            </div>

            <div className='row' >
              <div className='column start'>
                <p>Remaining:</p>
              </div>
              <div className='column'>
                <p>{item.percentRemaining}%</p>
              </div>
              <div className='column end'>
                <div className='button-container'>
                  <Button onClick={decreasePercent}>➖</Button>
                  <Button onClick={increasePercent}>➕</Button>
                </div>
              </div>
            </div>

            <div className='row' >

              <div className='column start'>
                <p>Replace By:</p>
              </div>
              <div className='column'>
                <p>{item.replaceBy}</p>
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


          </div>
        </>
      </Card>
    </>
  )
}