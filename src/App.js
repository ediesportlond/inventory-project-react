import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import Login from './scenes/Login';

function App() {
  return (
    <div className="App">
      <Routes>
        {
          !userEvent
          ? <Route index element={<Login />} />
          : <Route index element={<Login />} />
        }
      </Routes>
    </div>
  );
}

export default App;
