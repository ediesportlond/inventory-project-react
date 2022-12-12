import {useContext} from 'react';
import {UserContext} from '../App.js';
import firebaseConfig from '../firebaseConfig.js';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from 'antd';
import '../assets/login.css';
import logo from '../components/logo.png'

export default function Login() {
  const { setUser, setToken } = useContext(UserContext);

  const loginWithGoogle = async () => {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider)
          .catch(console.error);

      const token = result.user.stsTokenManager.accessToken;
      sessionStorage.setItem('token', token);
      setToken(token);

      sessionStorage.setItem('user', JSON.stringify(result.user));
      setUser(result.user);
  }

  return (
    <>
      <main>
        <div className='login-container'>
          <img src={logo} alt="Stock Up Logo" />
          <h3>At Home Inventory Management</h3>
          <Button onClick={loginWithGoogle} type='primary'>Login with Google</Button>
        </div>
      </main>      
    </>
  )
}