import { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { List, Skeleton } from 'antd';
import { UserContext } from '../App';
import Nav from '../components/Nav';
import UpdateCard from '../components/UpdateCard';
import SearchBar from '../components/SearchBar';

export default function ShoppingList() {
  const { token, setUser, setToken } = useContext(UserContext);
  const { search } = useParams();
  const [list, setList] = useState();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_ENDPOINT}/search/${search}`, {
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
      .then((result) => {
        setList(result.message);
      })
      .catch(console.error)
  }, [token, setToken, setUser, search, refresh])

  return (
    <>
      <Nav />
      <div className='container'>
        <SearchBar setList={setList} />
        <br />
        <br />
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
              grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
              dataSource={list}
              className='shopping-list-container'
              renderItem={item => (
                <List.Item key={item._id}>
                  <UpdateCard item={item} refresh={refresh} setRefresh={setRefresh} />
                </List.Item>
              )} />
        }

      </div>
    </>
  )
}