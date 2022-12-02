
import { useEffect, useContext, useState } from "react";
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import { List, Button, Alert } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

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

  const copyLink = (id) => {
    // navigator.clipboard.writeText(`http://inventory-project-ee.s3-website-us-east-1.amazonaws.com/view/${id}`)
    // <Alert message={`Your shopping list link is: http://inventory-project-ee.s3-website-us-east-1.amazonaws.com/view/${id}`} type="success" />
    alert(`Your shopping list link is: http://inventory-project-ee.s3-website-us-east-1.amazonaws.com/view/${id}`)
  }

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
          <List.Item key={item._id}>
            <Button type='text'
              onClick={(() => copyLink(item._id))}><CopyOutlined /></Button>
            <Link to={`/history/${item._id}`} >
              {item.createdDate.match(/^\d{4}-\d{2}-\d{2}/)} --- COST ${item.cost}
            </Link>
          </List.Item>
        )}
      />
    </div>
  )
}