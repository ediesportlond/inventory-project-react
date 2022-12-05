
import { useEffect, useContext, useState } from "react";
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import Nav from '../components/Nav';
import { List, Button, Alert } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import '../assets/history.css';

export default function AllHistory() {
  const { token, setUser, setToken } = useContext(UserContext);
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState();

  const handleClose = () => {
    setVisible(false);
  };

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
    // navigator.clipboard.writeText(`dtpyemhoit4nr.cloudfront.net/index.html/view/${id}`);
    setVisible(true);
    setMessage(`Your link to share this list is: \n dtpyemhoit4nr.cloudfront.net/index.html/view/${id}`);
  }

  return (
    <div className='container'>
      <Nav />
      {visible && (
        <Alert message={message} type="success" closable afterClose={handleClose} />
      )}
      <List
        header={<h3 style={{ textAlign: 'center' }}>Shopping History</h3>}
        bordered
        className='history-list'
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