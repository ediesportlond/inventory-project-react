import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, List } from 'antd';
import '../assets/guestHistory.css';
const { Meta } = Card;


export default function SingleHistory() {

  const [list, setList] = useState([]);
  const [cost, setCost] = useState();
  const { oid } = useParams();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_ENDPOINT}/guest/${oid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        setCost(res.message.cost)
        setList(res.message.list)
      })
      .catch(console.error);
  }, [setCost, setList, oid])

  return (
    <>
      <nav className='nav-back'>
        <h1>Shopping List</h1>
      </nav>
      <div className="container">
        <h3 className='estimated-cost'> Estimated Cost ${cost} </h3>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
          dataSource={list}
          renderItem={item => (
            <List.Item key={item._id} className='guest'>
              <Card
                hoverable
                style={{
                  width: 240,
                }}
                cover={<img alt="product" src={item?.image || 'https://placekitten.com/300/300'} />}
              >
                <Meta title={item.productName + (item.brand ? ' - ' + item.brand : '')} 
                description={'$'+item.price} />
              </Card>
            </List.Item>
          )}
        />
      </div>
    </>
  )
}