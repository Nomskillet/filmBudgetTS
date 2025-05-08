import React from 'react';
import type { Budget } from '../store/budgetSlice';
import type { Expense } from '../store/expenseSlice';

interface SearchResultCardProps {
  budget: Budget;
  expenses: Expense[];
  onEditExpense: (expense: Expense, budgetId: number) => void;
  onDeleteExpense: (expenseId: number, budgetId: number) => void;
}

function SearchResultCard({
  budget,
  expenses,
  onEditExpense,
  onDeleteExpense,
}: SearchResultCardProps) {
  return (
    <li className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition">
      <h2 className="text-xl font-bold text-purple-700 mb-2">{budget.title}</h2>
      <p className="text-gray-700">
        <span className="font-semibold">Owner:</span> {budget.owner || '—'}
      </p>
      <p className="text-gray-700 mb-2">
        <span className="font-semibold">Responsible:</span>{' '}
        {budget.responsible || '—'}
      </p>

      <ul className="space-y-2">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="border rounded p-4 bg-gray-50 shadow-sm flex justify-between items-start"
          >
            <div>
              <p className="font-semibold">{expense.description}</p>
              <p className="text-sm text-gray-700">
                Amount: ${Number(expense.amount).toFixed(2)}
              </p>
              {expense.owner && (
                <p className="text-sm text-gray-700">Owner: {expense.owner}</p>
              )}
              {expense.responsible && (
                <p className="text-sm text-gray-700">
                  Responsible: {expense.responsible}
                </p>
              )}
              {expense.place_of_purchase && (
                <p className="text-sm text-gray-700">
                  Place: {expense.place_of_purchase}
                </p>
              )}
              {expense.note && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 italic mb-1">Note:</p>
                  <ul className="text-sm text-gray-700 list-disc pl-5 whitespace-pre-line">
                    {expense.note.split('\n').map((line, idx) => (
                      <li key={idx}>{line.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}

              {expense.receipt_image_url && (
                <div className="mt-2">
                  <img
                    src={`/api/upload/image/${encodeURIComponent(
                      expense.receipt_image_url
                    )}`}
                    alt="Receipt"
                    className="max-w-xs border rounded"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 ml-4">
              <button
                onClick={() => onEditExpense(expense, budget.id)}
                className="text-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteExpense(expense.id, budget.id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default SearchResultCard;
