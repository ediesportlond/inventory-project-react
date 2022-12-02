import { useEffect, useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { List } from 'antd';
import { UserContext } from '../App';
import UpdateCard from '../components/UpdateCard';
import SearchBar from '../components/SearchBar';

export default function ShoppingList() {
  const { token, setUser, setToken } = useContext(UserContext);
  const { search } = useParams();
  const [list, setList] = useState([]);
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
          setUser()
          setToken()
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
        return res.json()
      })
      .then((result) => {
        setList(result.message)
      })
      .catch(console.error)
  }, [token, setToken, setUser, search, refresh])

  return (
    <>
      <nav className='nav-back'>
        <Link to='/' > <h2> &larr; Go Back </h2> </Link>
      </nav>
      <div className='container'>
      <SearchBar setList={setList} />
      <br />
      <br />
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
        dataSource={list}
        renderItem={item => (
          <List.Item key={item._id}>
            <UpdateCard item={item} refresh={refresh} setRefresh={setRefresh}/>
          </List.Item>
        )}
      />
      </div>
    </>
  )
}