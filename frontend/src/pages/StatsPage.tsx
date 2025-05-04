import React from 'react';
import { useGetBudgetsQuery } from '../store/budgetApi';
import { useGetAllExpensesQuery } from '../store/expenseApi';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

function StatsPage() {
  const { data: budgets = [], isLoading: budgetsLoading } =
    useGetBudgetsQuery();
  const { data: expenses = [], isLoading: expensesLoading } =
    useGetAllExpensesQuery();

  if (budgetsLoading || expensesLoading) {
    return (
      <div className="text-center mt-12 text-gray-500 text-lg">
        Loading stats...
      </div>
    );
  }

  const totalBudget = budgets.reduce(
    (sum, b) => sum + Number(b.budget || 0),
    0
  );
  const totalSpent = expenses
    .filter((e) => !e.deleted)
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const totalRemaining = totalBudget - totalSpent;

  const stats = [
    {
      label: 'Total Budgets',
      value: budgets.length,
      icon: '📁',
    },
    {
      label: 'Total Budgeted Amount',
      value: formatCurrency(totalBudget),
      icon: '💰',
    },
    {
      label: 'Total Spent',
      value: formatCurrency(totalSpent),
      icon: '💸',
    },
    {
      label: 'Total Remaining',
      value: formatCurrency(totalRemaining),
      icon: '🧾',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-4xl font-bold mb-8 text-purple-700 text-center">
        📊 Budget Stats Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{stat.icon}</div>
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-xl font-semibold text-gray-800">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsPage;
