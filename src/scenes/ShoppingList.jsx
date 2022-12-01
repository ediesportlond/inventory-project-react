import { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { List } from 'antd';
import { UserContext } from '../App';
import UpdateCard from '../components/UpdateCard';
import '../assets/shoppingList.css';

export default function ShoppingList() {
  const { token, setUser, setToken } = useContext(UserContext);
  const [list, setList] = useState([]);
  const [cost, setCost] = useState('');

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
  }, [token, setToken, setUser])

  return (
    <>
      <nav className='nav-back'>
        <Link to='/'> <h2> &larr; Go Back </h2> </Link>
      </nav>
      <div className='container'>
      <h3 className='estimated-cost'> Estimated Cost ${cost} </h3>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
        dataSource={list}
        className='shopping-list-container'
        renderItem={item => (
          <List.Item key={item._id}>
            <UpdateCard item={item} />
          </List.Item>
        )}
      />
      </div>
    </>
  )
}