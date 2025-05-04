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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
        <p className="text-gray-700 text-lg font-medium">Loading stats...</p>
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
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-purple-200 to-indigo-300 px-4 pt-20 sm:pt-24">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-purple-700 text-center">
          📊 Budget Stats Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{stat.icon}</div>
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
    </div>
  );
}

export default StatsPage;
