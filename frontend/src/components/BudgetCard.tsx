import React from 'react';
import type { Expense } from '../store/expenseSlice';
import type { Budget } from '../store/budgetSlice';

interface BudgetCardProps {
  budget: Budget;
  expenses: Expense[];
  editingId: number | null;
  editData: {
    title: string;
    budget: string;
    spent: string;
    owner: string;
    responsible: string;
    stage: string;
  };
  onEditClick: (budget: Budget, dynamicSpent: number) => void;
  onDeleteClick: (budgetId: number) => void;
  onSaveEdit: (budgetId: number) => void;
  onCancelEdit: () => void;
  onViewExpenses: (budgetId: number) => void;
  onAddExpenseClick: (budgetId: number) => void;
  onEditChange: (field: string, value: string) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  expenses,
  editingId,
  editData,
  onEditClick,
  onDeleteClick,
  onSaveEdit,
  onCancelEdit,
  onViewExpenses,
  onAddExpenseClick,
  onEditChange,
}) => {
  const dynamicSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const dynamicRemaining = budget.budget - dynamicSpent;

  return (
    <li className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      {editingId === budget.id ? (
        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold">
            Budget Name:
          </label>
          <input
            type="text"
            value={editData.title}
            onChange={(e) => onEditChange('title', e.target.value)}
            className="p-2 border rounded w-full"
          />
          <label className="block text-gray-700 font-semibold">
            Total Budget Amount:
          </label>
          <input
            type="text"
            value={editData.budget}
            onChange={(e) =>
              onEditChange('budget', e.target.value.replace(/^0+(?!$)/, ''))
            }
            className="p-2 border rounded w-full"
          />
          <label className="block text-gray-700 font-semibold mt-4">
            Owner:
          </label>
          <input
            type="text"
            value={editData.owner}
            onChange={(e) => onEditChange('owner', e.target.value)}
            className="p-2 border rounded w-full"
          />

          <label className="block text-gray-700 font-semibold mt-4">
            Responsible:
          </label>
          <input
            type="text"
            value={editData.responsible}
            onChange={(e) => onEditChange('responsible', e.target.value)}
            className="p-2 border rounded w-full"
          />

          <label className="block text-gray-700 font-semibold mt-4">
            Stage:
          </label>
          <select
            value={editData.stage}
            onChange={(e) => onEditChange('stage', e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="pre-production">Pre-production</option>
            <option value="production">Production</option>
            <option value="post-production">Post-production</option>
          </select>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onSaveEdit(budget.id)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={onCancelEdit}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold text-purple-700">
            {budget.title}
          </h2>
          <p className="text-gray-600">
            Budget: ${Number(budget.budget).toFixed(2)}
          </p>
          <p className="text-gray-600">Owner: {budget.owner || '—'}</p>
          <p className="text-gray-600">
            Responsible: {budget.responsible || '—'}
          </p>

          <p className="text-gray-600">
            Stage:{' '}
            {budget.stage
              ? budget.stage.charAt(0).toUpperCase() + budget.stage.slice(1)
              : '—'}
          </p>

          <p className="text-gray-600">Spent: ${dynamicSpent.toFixed(2)}</p>
          <p
            className={`text-gray-600 ${
              dynamicRemaining < 0 ? 'text-red-500' : ''
            }`}
          >
            Remaining:{' '}
            {dynamicRemaining < 0
              ? `-$${Math.abs(dynamicRemaining).toFixed(2)}`
              : `$${dynamicRemaining.toFixed(2)}`}
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => onEditClick(budget, dynamicSpent)}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteClick(budget.id)}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Delete
            </button>
            <button
              onClick={() => onViewExpenses(budget.id)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              View Expenses
            </button>
            <button
              onClick={() => onAddExpenseClick(budget.id)}
              className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
            >
              + Add Expense
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default BudgetCard;
