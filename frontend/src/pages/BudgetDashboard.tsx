import React from 'react';
import Navbar from '../components/Navbar';

interface Props {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const BudgetDashboard: React.FC<Props> = ({ isLoggedIn, onLogout }) => {
  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Budget Overview</h2>
      <p className="text-gray-600">The data for the budget will go here!</p>
    </div>
  );
};

export default BudgetDashboard;
