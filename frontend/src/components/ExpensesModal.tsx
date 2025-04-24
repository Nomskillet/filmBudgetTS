import React from 'react';
import type { Budget } from '../store/budgetSlice';
import type { Expense } from '../store/expenseSlice';

interface ExpensesModalProps {
  budget: Budget;
  allExpenses: Expense[];
  editingExpenseId: number | null;
  editExpenseData: {
    description: string;
    amount: string;
    owner: string;
    responsible: string;
    place_of_purchase: string;
    purchase_date: number | undefined;
    note: string;
  };
  setEditExpenseData: React.Dispatch<
    React.SetStateAction<{
      description: string;
      amount: string;
      owner: string;
      responsible: string;
      place_of_purchase: string;
      purchase_date: number | undefined;
      note: string;
    }>
  >;
  setEditingExpenseId: React.Dispatch<React.SetStateAction<number | null>>;
  handleEditExpenseClick: (expense: Expense, budgetId: number) => void;
  handleDeleteExpense: (expenseId: number, budgetId: number) => void;
  handleUpdateExpense: () => void;
  closeModal: () => void; // ✅ this is correct
}

const ExpensesModal: React.FC<ExpensesModalProps> = ({
  budget,
  allExpenses,
  editingExpenseId,
  editExpenseData,
  setEditExpenseData,
  setEditingExpenseId,
  handleEditExpenseClick,
  handleDeleteExpense,
  handleUpdateExpense,
  closeModal, // ✅ this is correct
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-h-[80vh] w-[90%] max-w-2xl overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          Expenses for: <span className="text-purple-700">{budget.title}</span>
        </h2>
        <ul className="space-y-4">
          {allExpenses
            .filter((e) => e.budget_id === budget.id && !e.deleted)
            .map((expense) => (
              <li key={expense.id} className="border rounded p-4 bg-gray-50">
                {editingExpenseId === expense.id ? (
                  <div className="flex flex-col gap-2">
                    {/* Editable fields */}
                    {[
                      'description',
                      'amount',
                      'owner',
                      'responsible',
                      'place_of_purchase',
                      'note',
                    ].map((field) => (
                      <label key={field}>
                        <span className="block text-sm text-gray-600">
                          {field.replace('_', ' ')}
                        </span>
                        <input
                          type={field === 'amount' ? 'number' : 'text'}
                          value={
                            editExpenseData[
                              field as keyof typeof editExpenseData
                            ]
                          }
                          onChange={(e) =>
                            setEditExpenseData((prev) => ({
                              ...prev,
                              [field as keyof typeof editExpenseData]:
                                e.target.value,
                            }))
                          }
                          className="border p-2 rounded w-full"
                        />
                      </label>
                    ))}

                    <label>
                      <span className="block text-sm text-gray-600">
                        Purchase Date
                      </span>
                      <input
                        type="date"
                        value={
                          editExpenseData.purchase_date
                            ? new Date(editExpenseData.purchase_date)
                                .toISOString()
                                .split('T')[0]
                            : ''
                        }
                        onChange={(e) =>
                          setEditExpenseData((prev) => ({
                            ...prev,
                            purchase_date: e.target.value
                              ? new Date(e.target.value).getTime()
                              : undefined,
                          }))
                        }
                        className="border p-2 rounded w-full"
                      />
                    </label>

                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={handleUpdateExpense}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingExpenseId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg">
                        {expense.description}: $
                        {Number(expense.amount).toFixed(2)}
                      </p>
                      {expense.owner && (
                        <p className="text-sm text-gray-700">
                          Owner: {expense.owner}
                        </p>
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
                      <p className="text-sm text-gray-700">
                        Date:{' '}
                        {expense.purchase_date &&
                        !isNaN(new Date(expense.purchase_date).getTime())
                          ? new Date(expense.purchase_date).toLocaleDateString()
                          : '—'}
                      </p>

                      {expense.note && (
                        <p className="text-sm text-gray-600 italic">
                          Note: {expense.note}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() =>
                          handleEditExpenseClick(expense, budget.id)
                        }
                        className="text-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteExpense(expense.id, budget.id)
                        }
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
        </ul>
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpensesModal;
