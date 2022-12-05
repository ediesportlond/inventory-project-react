import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { Avatar, Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import '../assets/nav.css';

export default function Nav() {
  const { user, setUser, setToken } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossOrigin="anonymous"></link>
      <nav style={{ justifyContent: 'space-around' }}>
        <h3>{<Avatar src={user.photoURL} />} {user?.displayName.match(/.+\s/) || 'Guest'}</h3>
        <Link to='shopping'><i className="fa fa-cart-plus" style={{ fontSize: '24px' }}></i></Link>
        <Button type="text" onClick={showDrawer}>
          <MenuOutlined className='hamburger' />
        </Button>

      </nav>
      <Drawer title="Navigation" placement="right" onClose={onClose} open={open}>
        <ul>
          <li><Button type='text' onClick={() => navigate('/')}>All Inventory</Button></li>
          <li><Button type='text' onClick={() => navigate('/shopping')}>Generate Shopping List </Button></li>
          <li><Button type='text' onClick={() => navigate('/history')}>Shopping List History </Button></li>
          <li><Button type='text' onClick={() => {
            setUser();
            setToken();
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
          }} style={{ cursor: 'pointer' }}>Log out</Button>
          </li>
        </ul>
      </Drawer>
    </>
  )
}