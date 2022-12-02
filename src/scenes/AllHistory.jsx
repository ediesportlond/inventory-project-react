
import { useEffect, useContext, useState } from "react";
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import { List } from 'antd';
import '../assets/history.css';

export default function AllHistory() {
  const { token, setUser, setToken } = useContext(UserContext);
  const [list, setList] = useState([])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_ENDPOINT}/history/list`, {
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
      .then(res => setList(res.message))
      .catch(console.error);

  }, [token, setToken, setUser])
  return (
    <div className='container'>
      <nav className='nav-back'>
        <Link to='/'> <h2> &larr; Go Back </h2> </Link>
      </nav>
      <List
        header={<h3 style={{ textAlign: 'center' }}>Shopping History</h3>}
        bordered
        dataSource={list}
        renderItem={(item) => (
          <List.Item>
            <Link to='/'>
              {item.createdDate.match(/^\d{4}-\d{2}-\d{2}/)} --- COST ${item.cost}
            </Link>
          </List.Item>
        )}
      />
    </div>
  )
}