import {useContext} from 'react';
import {Link} from 'react-router-dom';
import {UserContext} from '../App';
import '../assets/nav.css';

export default function Nav(){
  const {user, setUser, setToken} = useContext(UserContext);

  return (
    <nav>
        <h3>Welcome {user?.displayName.match(/.+\s/) || 'Guest'}</h3>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='shopping'>Shopping List</Link></li>
        <li><a href='/' onClick={()=>{
          setUser();
          setToken();
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("token");
        }} style={{cursor: 'pointer'}}>Log out</a></li>
      </ul>
    </nav>
  )
}