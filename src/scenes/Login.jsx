import {useContext} from 'react';
import {UserContext} from '../App.js';
import firebaseConfig from '../firebaseConfig.js';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from 'antd';
import '../assets/login.css';

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
          <h1>Welcome to Stock Up</h1>
          <p>A powerful application to manage your inventory of home goods.</p>
          <Button onClick={loginWithGoogle} type='primary'>Login with Google</Button>
        </div>
      </main>      
    </>
  )
}