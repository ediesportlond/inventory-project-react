import { useEffect, useContext, useState } from 'react';
import { List, Button } from 'antd';
import { UserContext } from '../App';
import Nav from '../components/Nav';
import UpdateCard from '../components/UpdateCard';
import { SaveOutlined } from '@ant-design/icons';
import '../assets/shoppingList.css';

export default function ShoppingList() {
  const { token, setUser, setToken } = useContext(UserContext);
  const [list, setList] = useState([]);
  const [cost, setCost] = useState('');
  const [refresh, setRefresh] = useState(false);

  const saveShoppingList = () => {
    const body = {
      cost: cost,
      list: list
    }
    fetch(`${process.env.REACT_APP_ENDPOINT}/history/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(body)
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
      .then(() => alert('Your list is saved'))
      .catch(console.error);
  }
  useEffect(() => {
    fetch(process.env.REACT_APP_ENDPOINT + '/shopping-list', {
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
      .then((result) => {
        setCost(result.message.shift().cost)
        setList(result.message)
      })
      .catch(console.error)
  }, [token, setToken, setUser, refresh])

  return (
    <>
      <Nav />
      <div className='container'>
        <h3 className='estimated-cost'> Estimated Cost ${cost} </h3>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
          dataSource={list}
          className='shopping-list-container'
          renderItem={item => (
            <List.Item key={item._id}>
              <UpdateCard item={item} refresh={refresh} setRefresh={setRefresh} />
            </List.Item>
          )}
        />
        <Button
          className='modal-btn'
          size='large'
          shape='circle'
          type='primary'
          onClick={saveShoppingList}
          icon={<SaveOutlined />}
        />
      </div>
    </>
  )
}