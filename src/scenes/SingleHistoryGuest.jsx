import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import { Card, List, Skeleton, Checkbox } from 'antd';
import defaultImg from './default-img.webp';
import '../assets/guestHistory.css';
import logo from '../components/logo.png'
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
        <img className='guest-nav-logo' src={logo} alt="Stock Up Logo" />
      </nav>
      <div className="container">
        <h2 className='estimated-cost'> Estimated Cost ${cost} </h2>
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
                      <div style={{display: 'flex', justifyContent: 'center'}}><Checkbox /></div>
                  </Card>
                </List.Item>
              )} />
        }
        <Footer />
      </div>
    </>
  )
}