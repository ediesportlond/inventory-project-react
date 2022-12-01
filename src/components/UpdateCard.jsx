import { useContext, useState } from 'react';
import { UserContext } from '../App';
import { Card, Avatar, Button, Input } from 'antd';
import '../assets/updateCard.css';

export default function UpdateCard({ item }) {
  const { token } = useContext(UserContext);
  const [inventory, setInventory] = useState(item.inventory);
  const [percent, setPercent] = useState(item.percentRemaining);
  const [date, setDate] = useState(item.replaceBy);
  const [price, setPrice] = useState(!isNaN(item.price) && item.price.toFixed(2));

  const increaseInventory = () => {

    fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/update/${item._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ inventory: inventory + 1 })
    })

    setInventory(inventory + 1);
  }

  const decreaseInventory = () => {
    if (inventory > 0) {
      fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/update/${item._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ inventory: inventory - 1 })
      })

      setInventory(inventory - 1);
    }
  }

  const increasePercent = () => {

    if (percent < 100) {

      fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/update/${item._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ percentRemaining: percent + 5 })
      })

      setPercent(percent + 5);
    }
  }

  const decreasePercent = () => {
    if (percent > 0) {
      fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/update/${item._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ percentRemaining: percent - 5 })
      })

      setPercent(percent - 5);
    }
  }

  const generateThreshold = (expiration, threshold) => {
    //option will be num days
    // const minute = 1000 * 60;
    // const hour = minute * 60;
    // const day = hour * 24;

    threshold = Date.parse(item.replaceBy + ' ') - Date.parse(threshold + ' ');
    expiration = Date.parse(expiration + ' '); //change NEW expiration to ms
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
      setDate(newDate);

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
      setDate(newDate);
    }


  }

  const handlePriceChange = ({target: {value}}) => {
    setPrice(value);
    fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/update/${item._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ price: Number(value) })
    })
  }

  return (
    <>
      <Card className='update-card' title={item.productName} 
      hoverable
      extra={<Avatar src={item.image || 'https://placekitten.com/100/100'} />} >
        <>
          <div className='update-card-body' >

            <div className='row' >
              <div className='column start'>
                <p>Available:</p>
              </div>
              <div className='column'>
                <p>{inventory}</p>
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
                <p>Percent Remaining:</p>
              </div>
              <div className='column'>
                <p>{percent}%</p>
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
                <p>{date}</p>
              </div>
              <div className='column end'>
                <Input className='update-card-input' type='date' defaultValue={item.replaceBy} onChange={handleDateChange} />
              </div>
            </div>
            
            <div className='row' >

              <div className='column start'>
                <p>Price:</p>
              </div>
              <div className='column'>
                <p>{price && `$${price}`}</p>
              </div>
              <div className='column end'>
                <Input className='update-card-input' type='number' min='0' step='.01' placeholder={price} onChange={handlePriceChange} />
              </div>
            </div>


          </div>
        </>
      </Card>
    </>
  )
}