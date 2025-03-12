import { Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './pages/HomePage';
import BudgetsPage from './pages/BudgetsPage';
import AddBudgetPage from './pages/AddBudgetPage';
import CreateUserPage from './pages/CreateUserPage';
import LoginPage from './pages/LoginPage';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('token')
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/'; // ✅ Redirect to home
  };

  return (
    <div>
      <nav className="bg-purple-600 shadow-lg p-4 text-white">
        <ul className="flex justify-center space-x-8 text-lg font-semibold">
          <li>
            <Link to="/">Home</Link>
          </li>

          {isLoggedIn && (
            <li>
              <Link to="/budgets">Budgets</Link>
            </li>
          )}

          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/add-budget" element={<AddBudgetPage />} />
        <Route path="/signup" element={<CreateUserPage />} />
        <Route
          path="/login"
          element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />
      </Routes>
    </div>
  );
}

export default App;
