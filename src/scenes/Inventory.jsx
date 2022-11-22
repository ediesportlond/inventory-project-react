import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../App';

import Nav from '../components/Nav'

export default function Inventory() {
  const { token } = useContext(UserContext);
  const [list, setList] = useState([])
  useEffect(() => {
    fetch(process.env.REACT_APP_ENDPOINT + '/inventory', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    })
      .then(res => res.json())
      .then((result)=>setList(result.message))
      .catch(console.error)
  }, [token])
  return (
    <>
      <Nav />
      {
        !list
          ? <p>Loading ... ⏱</p>
          : list.map(item => (
            <>
              <p>Item Id {item._id}</p>
              <p>User Id {item.uid}</p>
            </>
          ))
      }
    </>
  )
}