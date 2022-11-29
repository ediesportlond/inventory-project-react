import { useContext, useState } from 'react';
import { UserContext } from '../App';

import { Card, Avatar, Button, Input } from 'antd';

export default function UpdateCard({ item }) {
  const { token } = useContext(UserContext);
  const [inventory, setInventory] = useState(item.inventory);

  const increaseInventory = () => {

    fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/update/${item._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ inventory: inventory + 1 })
    })

    setInventory(inventory + 1)
  }

  return (
    <>
      <Card title={item.productName} extra={<Avatar src={item.image || 'https://placekitten.com/100/100'} />}
        style={{
          minWidth: '325px'
        }}>
        <>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className='row' style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className='column' style={{ width: '30%', display: 'flex', justifyContent: 'flex-start' }}>
                <p>Available:</p>
              </div>
              <div className='column' style={{ width: '30%', display: 'flex', justifyContent: 'center' }}>
                <p>{inventory}</p>
              </div>
              <div className='column' style={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                <div>
                  <Button>➖</Button>
                  <Button onClick={increaseInventory}>➕</Button>
                </div>
              </div>
            </div>

            <div className='row' style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className='column' style={{ width: '30%', display: 'flex', justifyContent: 'flex-start' }}>
                <p>Percent Remaining:</p>
              </div>
              <div className='column' style={{ width: '30%', display: 'flex', justifyContent: 'center' }}>
                <p>{item.percentRemaining}%</p>
              </div>
              <div className='column' style={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                <div><Button>➖</Button><Button>➕</Button></div>
              </div>
            </div>

            <div className='row' style={{ display: 'flex', justifyContent: 'space-between' }}>

              <div className='column' style={{ width: '30%', display: 'flex', justifyContent: 'flex-start' }}>
                <p>Replace By:</p>
              </div>
              <div className='column' style={{ width: '30%', display: 'flex', justifyContent: 'center' }}>
                <p>{item.replaceBy}</p>
              </div>
              <div className='column' style={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                <Input type='date' defaultValue={item.replaceBy} />
              </div>
            </div>
          </div>
        </>
      </Card>
    </>
  )
}