import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import {UserContext} from '../App';
import { Card, List, Avatar } from 'antd';

export default function SingleHistory() {

  const { token, setUser, setToken } = useContext(UserContext);
  const [list, setList] = useState([]);
  const [cost,setCost] = useState();
  const { oid } = useParams();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_ENDPOINT}/history/list/${oid}`, {
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
      .then(res => {
        setCost(res.message.cost)
        setList(res.message.list)
      })
      .catch(console.error);

  }, [token, setToken, setUser, oid])

  return (
    <>
      <nav className='nav-back'>
        <Link to='/' style={{color:'black'}}> <h2> &larr; Go Back </h2> </Link>
      </nav>
      <div className="container">
      <h3 className='estimated-cost'> Estimated Cost ${cost} </h3>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
          dataSource={list}
          renderItem={item => (
            <List.Item key={item._id}>
              <Card title={item.productName + (item.brand ? ' - ' + item.brand : '')} hoverable
                extra={<Avatar src={item.image || 'https://placekitten.com/100/100'} />}>
                <>
                  <p>Available: {item.inventory}</p>
                  <p>Percent Remaining: {item.percentRemaining}%</p>
                  {item.replaceBy ? <p>Replace By: {item.replaceBy}</p> : null}
                  {item.group ? <p>Group: {item.group}</p> : null}
                </>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </>
  )
}