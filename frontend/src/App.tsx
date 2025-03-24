import { useRoutes } from 'react-router-dom';
import { useState } from 'react';
import { routes } from './routes';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('token')
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const routing = useRoutes(routes(setIsLoggedIn, isLoggedIn));

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {routing}
    </div>
  );
}

export default App;
