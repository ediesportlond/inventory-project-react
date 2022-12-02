import { createContext, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './scenes/Login';
import Inventory from './scenes/Inventory';
import ShoppingList from './scenes/ShoppingList';
import Update from './scenes/Update';
import SearchResults from './scenes/SearchResults';
import AllHistory from './scenes/AllHistory';
import SingleHistory from './scenes/SingleHistory';
import Footer from './components/Footer';

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
          {
            !user
              ? <Route path='*' element={<Login />} />
              : <>
                <Route index element={<Inventory />} />
                <Route path='shopping' element={<ShoppingList />} />
                <Route path='update/:oid' element={<Update />} />
                <Route path='search/:search' element={<SearchResults />} />
                <Route path='history' element={<AllHistory />} />
                <Route path='history/:oid' element={<SingleHistory />} />
              </>
          }
        </Routes>
      </UserContext.Provider>
      <Footer />
    </div >
  );
}

export default App;
