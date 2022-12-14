
import { useEffect, useContext, useState } from "react";
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import Nav from '../components/Nav';
import { List, Button, Alert, Skeleton } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import '../assets/history.css';

export default function AllHistory() {
  const { token, setUser, setToken } = useContext(UserContext);
  const [list, setList] = useState();
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
          setUser();
          setToken();
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
        }
        return res.json();
      })
      .then(res => setList(res.message))
      .catch(console.error);

  }, [token, setToken, setUser])

  const copyLink = (id) => {
    const link = String(`https://www.stockup-app.com/view/${id}`)
    navigator.clipboard.writeText(link);
    setVisible(true);
    setMessage(`Your sharing link has been copied to your clipboard: https://www.stockup-app.com/view/${id}`);
  }

  return (
    <div className='container history-list-container'>
      <Nav />
      {visible && (
        <Alert message={message} type="success" closable afterClose={handleClose} />
      )}
      {
        !list
          ? <>
            <div style={{ width: '60%', marginRight: 'auto', marginLeft: 'auto' }}>
              <Skeleton active /><br />
              <Skeleton active /><br />
              <Skeleton active />
            </div>
          </>
          : <List
            header={<h2 style={{ textAlign: 'center' }}>Shopping History</h2>}
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
            )} />
      }
    </div>
  )
}