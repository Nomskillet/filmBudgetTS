import React from 'react';
import Navbar from '../components/Navbar';

const BudgetDashboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <Navbar />
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Budget Overview</h2>
      <p className="text-gray-600">The data for the budget will go here!</p>
    </div>
  );
};

export default BudgetDashboard;
