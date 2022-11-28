import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../App';
import Nav from '../components/Nav';

export default function ShoppingList() {
  const { token, setUser, setToken } = useContext(UserContext);
  const [list, setList] = useState([]);
  const [cost, setCost] = useState('');

  useEffect(() => {
    fetch(process.env.REACT_APP_ENDPOINT + '/shopping-list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    })
      .then(res => {
        if(res.status === 401){
          setUser()
          setToken()
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
        return res.json()
      })
      .then((result) => {
        setCost(result.message.shift().cost)
        setList(result.message)
      })
      .catch(console.error)
  }, [token, setToken, setUser])

  return (
    <>
      <Nav />
      Estimated cost {cost}
      {
        !Array.isArray(list)
          ? <p>⏱ Loading ... ⏱</p>
          : list.map(item => (
            <>
              <p key={item._id}>Item Id {item._id}</p>
              <p>User Id {item.uid}</p>
              <h3>{item.productName}</h3>
              <p>{item.inventory}</p>
              <p>{item.percentRemaining}</p>
              <p>{item.replaceBy}</p>
              <img src={item.image} alt="" width='300' />
            </>
          ))
      }
    </>
  )
}