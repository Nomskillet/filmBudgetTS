import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BudgetsPage from "./pages/BudgetsPage";
import AddBudgetPage from "./pages/AddBudgetPage";
import "./index.css";

function App() {
  return (
    <div>
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
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/add-budget" element={<AddBudgetPage />} />
      </Routes>
    </div>
  );
}

export default App;
