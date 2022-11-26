import { createContext, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './scenes/Login';
import Inventory from './scenes/Inventory';
import ShoppingList from './scenes/ShoppingList';
import Update from './scenes/Update';

export const UserContext = createContext({});

function App() {
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    const _user = JSON.parse(sessionStorage.getItem('user'))
    if (_user !== "") {
      setUser(_user)
      setToken(_user?.stsTokenManager.accessToken)
    }
  }, [])

  return (
    <div className="App">
      <UserContext.Provider value={{ user, setUser, token, setToken }} >
        <Routes>
        <Route path='update/:oid' element={<Update />} />
          {/* {
            !user
              ? <Route path='*' element={<Login />} />
              : <>
                <Route index element={<Inventory />} />
                <Route path='shopping' element={<ShoppingList />} />
                <Route path='update/:id' element={<ShoppingList />} />
              </>
          } */}
        </Routes>
      </UserContext.Provider>
    </div >
  );
}

export default App;
