import { useRoutes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { routes } from './routes';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('token')
  );

  // ✅ Add user state for role + email
  const [user, setUser] = useState<{
    role: string;
    email: string;
  } | null>(null);

  // ✅ Load user info from localStorage on page load (if logged in)
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    if (role && email) {
      setUser({ role, email });
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  const routing = useRoutes(routes(setIsLoggedIn, isLoggedIn));

  return (
    <div>
      {/* ✅ Pass user into Navbar */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} user={user!} />
      {routing}
    </div>
  );
}

export default App;
