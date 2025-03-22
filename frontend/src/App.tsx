import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './pages/HomePage';
import BudgetsPage from './pages/BudgetsPage';
import AddBudgetPage from './pages/AddBudgetPage';
import AuthPage from './pages/AuthPage';

import Navbar from './components/Navbar';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('token')
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/'; // Redirect to home
  };

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/add-budget" element={<AddBudgetPage />} />
        <Route
          path="/signup"
          element={
            <AuthPage initialMode="signup" setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route
          path="/login"
          element={
            <AuthPage initialMode="login" setIsLoggedIn={setIsLoggedIn} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
