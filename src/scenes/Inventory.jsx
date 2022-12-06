import { useEffect, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import Nav from '../components/Nav';
import AddNew from '../components/AddNew';
import SearchBar from '../components/SearchBar';
import Selector from '../components/Selector';
import { Button, Card, List, Progress, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import defaultImg from './default-img.jpg';
import '../assets/inventory.css';

export default function Inventory() {
  const { token, setUser, setToken } = useContext(UserContext);
  const [list, setList] = useState();
  const [showAddNew, setShowAddNew] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

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
          setUser();
          setToken();
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
        }
        return res.json();
      })
      .then((result) => setList(result.message))
      .catch(console.error);
  }, [token, setToken, setUser, refresh])

  const deleteItem = (id, productName) => {
    const confirmation = window.confirm(`Are you sure you want to delete ${productName}`);

    if (!confirmation) return;

    fetch(`${process.env.REACT_APP_ENDPOINT}/delete/${id}`, {
      method: 'DELETE',
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
      .then(() => setRefresh(!refresh))
      .catch(console.error);
  }

  return (
    <>
      <div className="inventory-container">
        <Nav />
        <div className="controls-container">
          <div>
            <SearchBar />
            <Selector setList={setList} />
          </div>
        </div>

        {
          !list
            ? <>
              <div style={{ width: '60%', marginRight: 'auto', marginLeft: 'auto' }}>
                <Skeleton.Image active /><br /><br />
                <Skeleton active /><br />
                <Skeleton.Image active /><br /><br />
                <Skeleton active /><br />
                <Skeleton.Image active /><br /><br />
                <Skeleton active />
              </div>
            </>
            : <List
              grid={{ gutter: 0, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
              dataSource={list}
              renderItem={item => (
                <List.Item key={item._id}>
                  <Link to={`/update/${item._id}`} >
                    <Card hoverable
                      cover={<img src={item.image || defaultImg} style={{ maxHeight: '220px', objectFit: 'contain' }} alt=''></img>} >
                      <>
                        <h2>{item.productName + (item.brand ? ' - ' + item.brand : '')}</h2>
                        <p>In Stock: {item.inventory}</p>
                        {item.replaceBy ? <p>Replace By: {item.replaceBy}</p> : null}
                        {item.group ? <p>Group:
                          <Button type='text' onClick={(e) => {
                            e.preventDefault()
                            navigate(`/search/${item.group}`)
                          }}><b>{item.group}</b></Button>
                        </p> : null}
                        <Progress percent={item.percentRemaining} />
                        <div className='delete-container'>
                          <Button type='text' onClick={(e) => {
                            e.preventDefault();
                            deleteItem(item._id, item.productName)
                          }}>
                            Delete</Button>
                        </div>
                      </>
                    </Card>
                  </Link>
                </List.Item>
              )} />
        }


        {showAddNew && <AddNew setShowAddNew={setShowAddNew} setList={setList} />}
        <Button
          className='modal-btn'
          onClick={() => setShowAddNew(true)}
          size='large'
          shape='circle'
          type='primary'
          icon={<PlusOutlined />}
        />
      </div>
    </>
  )
}