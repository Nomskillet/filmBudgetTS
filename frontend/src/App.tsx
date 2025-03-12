import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BudgetsPage from './pages/BudgetsPage';
import AddBudgetPage from './pages/AddBudgetPage';
import CreateUserPage from './pages/CreateUserPage';
import LoginPage from './pages/LoginPage';
import './index.css';

function App() {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-purple-600 shadow-lg p-4 text-white">
        <ul className="flex justify-center space-x-8 text-lg font-semibold">
          <li>
            <Link to="/" className="hover:text-purple-300 transition-all">
              Home
            </Link>
          </li>
          <li>
            <Link to="/budgets" className="hover:text-blue-300 transition-all">
              Budgets
            </Link>
          </li>
          <li>
            <Link to="/signup" className="hover:text-green-300 transition-all">
              Sign Up
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-yellow-300 transition-all">
              Login
            </Link>
          </li>
        </ul>
      </nav>

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/add-budget" element={<AddBudgetPage />} />
        <Route path="/signup" element={<CreateUserPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
