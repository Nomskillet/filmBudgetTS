import { RouteObject } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BudgetsPage from './pages/BudgetsPage';
import AddBudgetPage from './pages/AddBudgetPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';

export const routes = (
  setIsLoggedIn: (val: boolean) => void,
  isLoggedIn: boolean
): RouteObject[] => [
  {
    path: '/',
    element: <HomePage />,
  },

  {
    path: '/budgets',
    element: (
      <ProtectedRoute isLoggedIn={isLoggedIn}>
        <BudgetsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/add-budget',
    element: (
      <ProtectedRoute isLoggedIn={isLoggedIn}>
        <AddBudgetPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/signup',
    element: <AuthPage initialMode="signup" setIsLoggedIn={setIsLoggedIn} />,
  },
  {
    path: '/login',
    element: <AuthPage initialMode="login" setIsLoggedIn={setIsLoggedIn} />,
  },
];
