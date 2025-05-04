import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar: React.FC<{
  isLoggedIn: boolean;
  onLogout: () => void;
  user?: { role: string; email: string };
}> = ({ isLoggedIn, onLogout, user }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getActiveClass = (path: string) =>
    location.pathname === path ? 'text-yellow-300' : 'text-white';

  return (
    <nav className="bg-purple-600 shadow-md px-4 py-3">
      <div className="max-w-7xl mx-auto relative flex items-center justify-center">
        <div className="sm:hidden flex justify-between items-center w-full">
          <Link to="/" className="text-white font-bold text-xl">
            🎬 Film Budget Tracker
          </Link>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="text-white text-2xl"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex flex-1 justify-center space-x-6 text-white text-md font-semibold">
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
              <button onClick={onLogout} className="hover:underline">
                Logout
              </button>
            </li>
          )}
        </ul>

        {/* Desktop User Info */}
        {isLoggedIn && user && (
          <div className="hidden sm:block absolute right-4 text-sm text-white text-right">
            <p className="font-semibold">
              Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
            <p className="text-xs">{user.email}</p>
          </div>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="sm:hidden mt-3 bg-purple-500 rounded-lg px-6 py-4 text-white text-center space-y-4">
          <div className="space-y-2 text-lg">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block">
              Home
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  to="/budgets"
                  onClick={() => setIsMenuOpen(false)}
                  className="block"
                >
                  Budgets
                </Link>
                <Link
                  to="/stats"
                  onClick={() => setIsMenuOpen(false)}
                  className="block"
                >
                  Stats
                </Link>
              </>
            )}
            {!isLoggedIn ? (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block"
              >
                Login / Sign Up
              </Link>
            ) : (
              <button
                onClick={onLogout}
                className="block text-white text-lg hover:underline mx-auto"
              >
                Logout
              </button>
            )}
          </div>

          {isLoggedIn && user && (
            <div className="pt-2 border-t border-purple-300 text-sm text-purple-100">
              <p className="font-semibold">
                Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
              <p className="text-xs">{user.email}</p>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
