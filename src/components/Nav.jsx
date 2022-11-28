import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import { Avatar } from 'antd';
import '../assets/nav.css';

export default function Nav() {
  const { user, setUser, setToken } = useContext(UserContext);
  console.log(user.photoURL)

  return (
    <>
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossOrigin="anonymous"></link>
      <nav style={{justifyContent: 'space-around'}}>
        <h3>{<Avatar src={String(user.photoURL)} />} {user?.displayName.match(/.+\s/) || 'Guest'}</h3>
        <Link to='shopping'><i className="fa fa-cart-plus" style={{fontSize:'24px'}}></i></Link>
        <a href='/' onClick={() => {
          setUser();
          setToken();
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("token");
        }} style={{ cursor: 'pointer' }}>Log out</a>

      </nav>
    </>
  )
}