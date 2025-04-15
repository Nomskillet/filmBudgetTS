import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC<{ isLoggedIn: boolean; onLogout: () => void }> = ({
  isLoggedIn,
  onLogout,
}) => {
  const location = useLocation();

  // ✅ Add highlight style to active page
  const getActiveClass = (path: string) =>
    location.pathname === path ? 'text-yellow-300' : 'text-white';

  return (
    <nav className="bg-purple-600 shadow-lg p-4">
      <ul className="flex justify-center space-x-8 text-lg font-semibold">
        <li>
          <Link to="/" className={getActiveClass('/')}>
            Home
          </Link>
        </li>

        {isLoggedIn && (
          <>
            <li>
              <Link to="/budgets" className={getActiveClass('/budgets')}>
                Budgets
              </Link>
            </li>
            <li>
              <Link to="/stats" className={getActiveClass('/stats')}>
                Stats
              </Link>
            </li>
          </>
        )}

        {!isLoggedIn ? (
          <li>
            <Link to="/login" className={getActiveClass('/login')}>
              Login / Sign Up
            </Link>
          </li>
        ) : (
          <li>
            <button onClick={onLogout} className="text-white hover:underline">
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
