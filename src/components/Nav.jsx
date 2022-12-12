import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { Avatar, Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import logo from './logo.png';
import '../assets/nav.css';

export default function Nav() {
  const { user, setUser, setToken } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <nav style={{ justifyContent: 'space-around' }}>
        <h4>{<Avatar src={user.photoURL} />} <span style={{fontFamily: 'system-ui', fontWeight: 'normal'}}>{user?.displayName.match(/.+\s/) || 'Guest'}</span></h4>
        <Link to='/'><img className='stock-up-logo' src={logo} alt="Stock Up Logo" /></Link>
        <Button type="text" onClick={showDrawer}>
          <MenuOutlined className='hamburger' />
        </Button>

      </nav>
      <Drawer title="Navigation" placement="right" onClose={onClose} open={open}>
        <ul>
          <li><Button type='text' onClick={() => navigate('/')}>All Inventory</Button></li>
          <li><Button type='text' onClick={() => navigate('/shopping')}>New Shopping List </Button></li>
          <li><Button type='text' onClick={() => navigate('/history')}>Shopping History </Button></li>
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