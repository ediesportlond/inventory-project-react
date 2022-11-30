import { useEffect, useContext, useState } from 'react';
import {Link} from 'react-router-dom';
import { UserContext } from '../App';
import Nav from '../components/Nav';
import AddNew from '../components/AddNew';
import SearchBar from '../components/SearchBar';
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
      <SearchBar />
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3}}
        dataSource={list}
        renderItem={item => (
          <List.Item key={item._id}>
            <Link to={`/update/${item._id}`} >
              <Card title={item.productName} hoverable
              extra={<Avatar src={item.image || 'https://placekitten.com/100/100'} />}>
                <>
                  <p>Available: {item.inventory}</p>
                  <p>Percent Remaining: {item.percentRemaining}%</p>
                  {item.replaceBy ? <p>Replace By: {item.replaceBy}</p>: null}
                  {item.group ? <p>Group: {item.group}</p>: null}
                </>
              </Card>
            </Link>
          </List.Item>
        )}
      />

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