import { useEffect, useContext, useState } from 'react';
import {Link} from 'react-router-dom';
import { UserContext } from '../App';
import Nav from '../components/Nav';
import AddNew from '../components/AddNew';
import { Button, Avatar, Card, List } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import '../assets/inventory.css';

export default function Inventory() {
  const { token, setUser, setToken } = useContext(UserContext);
  const [list, setList] = useState([]);
  const [showAddNew, setShowAddNew] = useState(false);
  useEffect(() => {
    fetch(process.env.REACT_APP_ENDPOINT + '/inventory', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
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
      .then((result) => setList(result.message))
      .catch(console.error)
  }, [token, setToken, setUser])

  return (
    <>
      <Nav />

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3}}
        dataSource={list}
        renderItem={item => (
          <List.Item key={item._id}>
            <Link to={`/update/${item._id}`} >
              <Card title={item.productName} extra={<Avatar src={item.image || 'https://placekitten.com/100/100'} />}>
                <>
                  <p>Available {item.inventory}</p>
                  <p>Percent Remaining {item.percentRemaining}</p>
                  {item.replaceBy ? <p>Replace By {item.replaceBy}</p>: null}
                </>
              </Card>
            </Link>
          </List.Item>
        )}
      />

      {/* {
        !Array.isArray(list)
          ? <p>⏱ Loading ... ⏱</p>
          : list.map(item => (
            <>
              <p key={item._id}>Item Id {item._id}</p>
              <p>User Id {item.uid}</p>
              <h3>{item.productName}</h3>
              <p>{item.inventory}</p>
              <p>{item.percentRemaining}</p>
              <p>{item.replaceBy}</p>
              <img src={item.image} alt="" width='300' />
            </>
          ))
      } */}

      {showAddNew && <AddNew setShowAddNew={setShowAddNew} setList={setList} />}
      <Button
        className='modal-btn'
        onClick={() => setShowAddNew(true)}
        size='large'
        shape='circle'
        type='primary'
        icon={<PlusOutlined />}
      />
    </>
  )
}