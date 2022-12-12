import { useState, useContext } from 'react';
import { Link } from 'react-router-dom'
import { UserContext } from '../App';
import { Button } from 'antd';
import '../assets/selector.css';

export default function Selector({ setList }) {
  const { token, setUser, setToken } = useContext(UserContext);
  const [selected, setSelected] = useState();


  const getSelected = (selected) => {
    setSelected(selected);
    fetch(`${process.env.REACT_APP_ENDPOINT}/inventory/select/${selected}`, {
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
        return res.json()
      })
      .then((result) => setList(result.message))
      .catch(console.error);

  }

  const getAll = () => {
    setSelected('all');
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
  }

  return (
    <>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossOrigin="anonymous"></link>
      <div className="selector-btn-container">
        {
          selected === 'instock'
            ? <>
              <Button type='primary' onClick={() => getSelected('instock')}>In stock</Button>
              <Button type='text'><Link to='/shopping'><i className="fa fa-cart-plus" ></i></Link></Button>
              <Button danger ghost onClick={() => getSelected('nostock')}>Out of stock</Button>
            </>
            : selected === 'nostock'
              ? <>
                <Button type='primary' ghost onClick={() => getSelected('instock')}>In stock</Button>
                <Button type='text'><Link to='/shopping'><i className="fa fa-cart-plus" ></i></Link></Button>
                <Button type='primary' danger onClick={() => getSelected('nostock')}>Out of stock</Button>
              </>
              : <>
                  <Button type='primary' ghost onClick={() => getSelected('instock')}>In stock</Button>
                  <Button type='text'><Link to='/shopping'><i className="fa fa-cart-plus" ></i></Link></Button>
                  <Button danger ghost onClick={() => getSelected('nostock')}>Out of stock</Button>
                </>
        }
      </div>
    </>
  )
}