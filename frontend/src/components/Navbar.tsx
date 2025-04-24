import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC<{
  isLoggedIn: boolean;
  onLogout: () => void;
  user?: { role: string; email: string };
}> = ({ isLoggedIn, onLogout, user }) => {
  const location = useLocation();

  const getActiveClass = (path: string) =>
    location.pathname === path ? 'text-yellow-300' : 'text-white';

  return (
    <div className="relative">
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

        {/* ✅ Role and Email shown in top-right */}
        {isLoggedIn && user && (
          <div className="absolute top-2 right-4 text-right text-white text-sm leading-tight">
            <p className="font-semibold">
              Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
            <p className="text-xs">{user.email}</p>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
