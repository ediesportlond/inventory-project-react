import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { Input } from 'antd';
const { Search } = Input;

export default function SearchBar({ setList }) {
  const navigate = useNavigate();
  const { token, setUser, setToken } = useContext(UserContext);
  let onSearch;
  if (!setList) {
    onSearch = (value) => navigate(`/search/${value}`);
  } else {
    onSearch = (value) => {
      fetch(`${process.env.REACT_APP_ENDPOINT}/search/${value}`, {
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

    }
  }

  return (
    <>
      <Search
        placeholder="Search by product, brand or group"
        allowClear
        enterButton="Search"
        size="large"
        style={{padding: '0 1.25rem'}}
        onSearch={onSearch}
      />
    </>
  )
}