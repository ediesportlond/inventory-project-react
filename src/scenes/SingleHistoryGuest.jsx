import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, List, Skeleton } from 'antd';
import defaultImg from './default-img.jpg';
import '../assets/guestHistory.css';
const { Meta } = Card;


export default function SingleHistory() {

  const [list, setList] = useState();
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
        setCost(res.message.cost);
        setList(res.message.list);
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
        {
          !list
            ? <>
              <div style={{ width: '60%', marginRight: 'auto', marginLeft: 'auto' }}>
                <Skeleton.Image active /><br /><br />
                <Skeleton active /><br />
                <Skeleton.Image active /><br /><br />
                <Skeleton active /><br />
                <Skeleton.Image active /><br /><br />
                <Skeleton active />
              </div>
            </>
            : <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
              dataSource={list}
              renderItem={item => (
                <List.Item key={item._id} className='guest'>
                  <Card
                    hoverable
                    style={{
                      width: 240
                    }}
                    cover={<img alt="product" src={item?.image || defaultImg} height='160' style={{ objectFit: 'contain' }} />}
                  >
                    <Meta title={item.productName + (item.brand ? ' - ' + item.brand : '')}
                      description={!isNaN(item?.price) && `$${Number(item?.price).toFixed(2)}`} />
                  </Card>
                </List.Item>
              )} />
        }

      </div>
    </>
  )
}