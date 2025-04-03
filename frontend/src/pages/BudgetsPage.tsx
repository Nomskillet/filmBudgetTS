import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import // fetchBudgets,
// updateBudgetThunk,
// deleteBudgetThunk,
'../store/budgetSlice';
import {
  fetchExpenses,
  addExpenseThunk,
  updateExpenseThunk,
  deleteExpenseThunk,
} from '../store/expenseSlice';
import type { Expense } from '../store/expenseSlice';
import type { Budget } from '../store/budgetSlice';
import {
  useGetBudgetsQuery,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation, // ← add this
} from '../store/budgetApi';

function BudgetsPage() {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  const {
    data: budgets = [],
    isLoading: loading,
    error,
  } = useGetBudgetsQuery();

  const [updateBudget] = useUpdateBudgetMutation();
  const [deleteBudget] = useDeleteBudgetMutation();

  const expenseState = useAppSelector((state) => state.expense);

  const [filteredBudgets, setFilteredBudgets] = useState<Budget[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    title: '',
    budget: '0',
    spent: '0',
  });
  const [search, setSearch] = useState<string>('');

  const [activeBudget, setActiveBudget] = useState<number | null>(null);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<number | null>(
    null
  );
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    owner: '',
    responsible: '',
    place_of_purchase: '',
    purchase_date: undefined as number | undefined,
    note: '',
  });

  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [editExpenseData, setEditExpenseData] = useState({
    description: '',
    amount: '',
    owner: '',
    responsible: '',
    place_of_purchase: '',
    purchase_date: undefined as number | undefined,
    note: '',
  });

  const [filteredExpenseGroups, setFilteredExpenseGroups] = useState<
    { budget: Budget; expenses: Expense[] }[]
  >([]);

  const [openedFromSearch, setOpenedFromSearch] = useState(false);

  const [viewExpensesModalBudget, setViewExpensesModalBudget] =
    useState<Budget | null>(null);

  // useEffect(() => {
  //   dispatch(fetchBudgets());
  // }, [dispatch, navigate]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredExpenseGroups([]);
      return;
    }

    const lowercaseSearch = search.toLowerCase();

    const groups = budgets
      .map((budget) => {
        const allExpenses = expenseState.items[budget.id] || [];

        const matchingExpenses = allExpenses.filter((expense) => {
          return [
            expense.description,
            expense.owner,
            expense.responsible,
            expense.place_of_purchase,
            expense.note,
          ]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(lowercaseSearch));
        });

        if (matchingExpenses.length > 0) {
          return { budget, expenses: matchingExpenses };
        }

        return null;
      })
      .filter(Boolean) as { budget: Budget; expenses: Expense[] }[];

    setFilteredExpenseGroups(groups);
  }, [search, budgets, expenseState.items]);

  useEffect(() => {
    setFilteredBudgets(
      budgets.filter((budget) => {
        const budgetTitleMatch = budget.title
          .toLowerCase()
          .includes(search.toLowerCase());
        const expenses = expenseState.items[budget.id] || [];

        const expenseMatch = expenses.some((expense) =>
          [
            expense.description,
            expense.owner,
            expense.responsible,
            expense.place_of_purchase,
            expense.note,
          ]
            .filter(Boolean)
            .some((field) =>
              field?.toLowerCase().includes(search.toLowerCase())
            )
        );

        return budgetTitleMatch || expenseMatch;
      })
    );

    budgets.forEach((b) => dispatch(fetchExpenses(b.id)));
  }, [search, budgets, dispatch]);

  const handleViewExpenses = (budgetId: number) => {
    const selected = budgets.find((b) => b.id === budgetId);
    if (selected) {
      setViewExpensesModalBudget(selected);
    }
  };

  const handleAddExpense = () => {
    if (!showAddExpenseModal) return;
    dispatch(
      addExpenseThunk({
        budgetId: showAddExpenseModal,
        expenseData: {
          description: newExpense.description,
          amount: parseFloat(newExpense.amount),
          owner: newExpense.owner,
          responsible: newExpense.responsible,
          place_of_purchase: newExpense.place_of_purchase,
          purchase_date: newExpense.purchase_date,
          note: newExpense.note,
        },
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Expense added successfully!');
        setNewExpense({
          description: '',
          amount: '',
          owner: '',
          responsible: '',
          place_of_purchase: '',
          purchase_date: undefined as number | undefined,
          note: '',
        });

        dispatch(fetchExpenses(showAddExpenseModal));
        setShowAddExpenseModal(null);
      })
      .catch((err) => {
        console.error('Add expense error:', err);
        toast.error('Failed to add expense');
      });
  };

  const handleEditExpenseClick = (expense: Expense, budgetId: number) => {
    setEditingExpenseId(expense.id);
    setActiveBudget(budgetId);
    setEditExpenseData({
      description: expense.description,
      amount: expense.amount.toString(),
      owner: expense.owner || '',
      responsible: expense.responsible || '',
      place_of_purchase: expense.place_of_purchase || '',
      purchase_date: expense.purchase_date
        ? Number(expense.purchase_date)
        : undefined,
      note: expense.note || '',
    });

    // ✅ Only open the modal if it's not already open
    if (!viewExpensesModalBudget || viewExpensesModalBudget.id !== budgetId) {
      const matchingBudget = budgets.find((b) => b.id === budgetId);
      if (matchingBudget) {
        setViewExpensesModalBudget(matchingBudget);
      }
    }
  };

  const handleUpdateExpense = () => {
    if (!editingExpenseId || activeBudget === null) return;

    dispatch(
      updateExpenseThunk({
        expenseId: editingExpenseId,
        expenseData: {
          description: editExpenseData.description,
          amount: parseFloat(editExpenseData.amount),
          owner: editExpenseData.owner,
          responsible: editExpenseData.responsible,
          place_of_purchase: editExpenseData.place_of_purchase,
          purchase_date: editExpenseData.purchase_date,
          note: editExpenseData.note,
        },
        budgetId: activeBudget,
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Expense updated successfully!');
        setEditingExpenseId(null);
        dispatch(fetchExpenses(activeBudget));

        // ✅ Only close the modal if it was opened via search
        if (openedFromSearch) {
          setViewExpensesModalBudget(null);
          setOpenedFromSearch(false); // clear flag
        }
      })
      .catch(() => toast.error('Failed to update expense'));
  };

  const handleDeleteExpense = (expenseId: number, budgetId: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this expense?'
    );

    if (!confirmDelete) return;

    dispatch(deleteExpenseThunk({ expenseId, budgetId }))
      .unwrap()
      .then(() => {
        toast.success('Expense deleted successfully!');
        dispatch(fetchExpenses(budgetId));
      })
      .catch(() => toast.error('Failed to delete expense'));
  };

  const handleUpdate = (id: number) => {
    const requestBody = {
      title: editData.title,
      budget: parseFloat(editData.budget.replace(/^0+(?!$)/, '')) || 0,
      spent: parseFloat(editData.spent.replace(/^0+(?!$)/, '')) || 0,
    };

    updateBudget({ id, updatedData: requestBody })
      .unwrap()
      .then(() => {
        toast.success('Budget updated successfully!');
        setEditingId(null);
      })
      .catch(() => toast.error('Failed to update budget'));
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this budget?'
    );

    if (!confirmDelete) return;

    deleteBudget(id)
      .unwrap()
      .then(() => toast.success('Budget deleted successfully!'))
      .catch(() => toast.error('Failed to delete budget'));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4f46e5" size={60} />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500">
        {typeof error === 'object' && 'status' in error
          ? `Error: ${error.status}`
          : 'An unexpected error occurred.'}
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Budget Dashboard</h1>
        <Link to="/add-budget">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            + Add Budget
          </button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search budgets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      {showAddExpenseModal !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Expense</h2>
            <input
              type="text"
              placeholder="Expense Description"
              className="border p-2 w-full mb-2 rounded"
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Owner"
              className="border p-2 w-full mb-2 rounded"
              value={newExpense.owner}
              onChange={(e) =>
                setNewExpense({ ...newExpense, owner: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Amount"
              className="border p-2 w-full mb-2 rounded"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Responsible"
              className="border p-2 w-full mb-2 rounded"
              value={newExpense.responsible}
              onChange={(e) =>
                setNewExpense({ ...newExpense, responsible: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Place of Purchase"
              className="border p-2 w-full mb-2 rounded"
              value={newExpense.place_of_purchase}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  place_of_purchase: e.target.value,
                })
              }
            />

            <input
              type="date"
              className="border p-2 w-full mb-2 rounded"
              value={
                newExpense.purchase_date
                  ? new Date(newExpense.purchase_date)
                      .toISOString()
                      .split('T')[0]
                  : ''
              }
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  purchase_date: e.target.value
                    ? new Date(e.target.value).getTime()
                    : undefined,
                })
              }
            />

            <textarea
              placeholder="Note"
              className="border p-2 w-full mb-2 rounded"
              value={newExpense.note}
              onChange={(e) =>
                setNewExpense({ ...newExpense, note: e.target.value })
              }
            />

            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => setShowAddExpenseModal(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleAddExpense}
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      <ul className="space-y-4">
        {search.trim() === ''
          ? filteredBudgets.map((budget) => {
              const expenses = expenseState.items[budget.id] || [];
              const dynamicSpent = expenses.reduce(
                (sum, e) => sum + Number(e.amount),
                0
              );
              const dynamicRemaining = budget.budget - dynamicSpent;

              return (
                <li
                  key={budget.id}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                >
                  {editingId === budget.id ? (
                    <div className="space-y-2">
                      <label className="block text-gray-700 font-semibold">
                        Budget Name:
                      </label>
                      <input
                        type="text"
                        value={editData.title}
                        onChange={(e) =>
                          setEditData({ ...editData, title: e.target.value })
                        }
                        className="p-2 border rounded w-full"
                      />
                      <label className="block text-gray-700 font-semibold">
                        Total Budget Amount:
                      </label>
                      <input
                        type="text"
                        value={editData.budget}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            budget: e.target.value.replace(/^0+(?!$)/, ''),
                          })
                        }
                        className="p-2 border rounded w-full"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleUpdate(budget.id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
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
                      <p className="text-gray-600">
                        Spent: ${dynamicSpent.toFixed(2)}
                      </p>
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
                          onClick={() => {
                            setEditingId(budget.id);
                            setEditData({
                              title: budget.title,
                              budget: budget.budget.toString(),
                              spent: dynamicSpent.toString(),
                            });
                          }}
                          className="px-4 py-2 bg-yellow-500 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(budget.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleViewExpenses(budget.id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                          View Expenses
                        </button>
                        <button
                          onClick={() => setShowAddExpenseModal(budget.id)}
                          className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
                        >
                          + Add Expense
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })
          : filteredExpenseGroups.map(({ budget, expenses }) => (
              <li
                key={budget.id}
                className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition"
              >
                <h2 className="text-xl font-bold text-purple-700 mb-2">
                  {budget.title}
                </h2>
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
                        {expense.note && (
                          <p className="text-sm italic text-gray-600">
                            Note: {expense.note}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => {
                            setOpenedFromSearch(true);
                            handleEditExpenseClick(expense, budget.id);
                          }}
                          className="text-blue-500"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteExpense(expense.id, budget.id)
                          }
                          className="text-red-500 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
      </ul>

      {viewExpensesModalBudget && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-h-[80vh] w-[90%] max-w-2xl overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              Expenses for:{' '}
              <span className="text-purple-700">
                {viewExpensesModalBudget.title}
              </span>
            </h2>
            <ul className="space-y-4">
              {(expenseState.items[viewExpensesModalBudget.id] || []).map(
                (expense) => (
                  <li
                    key={expense.id}
                    className="border rounded p-4 bg-gray-50"
                  >
                    {editingExpenseId === expense.id ? (
                      <div className="flex flex-col gap-2">
                        <label>
                          <span className="block text-sm text-gray-600">
                            Description
                          </span>
                          <input
                            type="text"
                            value={editExpenseData.description}
                            onChange={(e) =>
                              setEditExpenseData({
                                ...editExpenseData,
                                description: e.target.value,
                              })
                            }
                            className="border p-2 rounded w-full"
                          />
                        </label>

                        <label>
                          <span className="block text-sm text-gray-600">
                            Amount
                          </span>
                          <input
                            type="number"
                            value={editExpenseData.amount}
                            onChange={(e) =>
                              setEditExpenseData({
                                ...editExpenseData,
                                amount: e.target.value,
                              })
                            }
                            className="border p-2 rounded w-full"
                          />
                        </label>

                        <label>
                          <span className="block text-sm text-gray-600">
                            Owner
                          </span>
                          <input
                            type="text"
                            value={editExpenseData.owner}
                            onChange={(e) =>
                              setEditExpenseData({
                                ...editExpenseData,
                                owner: e.target.value,
                              })
                            }
                            className="border p-2 rounded w-full"
                          />
                        </label>

                        <label>
                          <span className="block text-sm text-gray-600">
                            Responsible
                          </span>
                          <input
                            type="text"
                            value={editExpenseData.responsible}
                            onChange={(e) =>
                              setEditExpenseData({
                                ...editExpenseData,
                                responsible: e.target.value,
                              })
                            }
                            className="border p-2 rounded w-full"
                          />
                        </label>

                        <label>
                          <span className="block text-sm text-gray-600">
                            Place of Purchase
                          </span>
                          <input
                            type="text"
                            value={editExpenseData.place_of_purchase}
                            onChange={(e) =>
                              setEditExpenseData({
                                ...editExpenseData,
                                place_of_purchase: e.target.value,
                              })
                            }
                            className="border p-2 rounded w-full"
                          />
                        </label>

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
                              setEditExpenseData({
                                ...editExpenseData,
                                purchase_date: e.target.value
                                  ? new Date(e.target.value).getTime()
                                  : undefined,
                              })
                            }
                            className="border p-2 rounded w-full"
                          />
                        </label>

                        <label>
                          <span className="block text-sm text-gray-600">
                            Note
                          </span>
                          <textarea
                            value={editExpenseData.note}
                            onChange={(e) =>
                              setEditExpenseData({
                                ...editExpenseData,
                                note: e.target.value,
                              })
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
                          {expense.purchase_date && (
                            <p className="text-sm text-gray-700">
                              Date:{' '}
                              {new Date(
                                Number(expense.purchase_date)
                              ).toLocaleDateString()}
                            </p>
                          )}
                          {expense.note && (
                            <p className="text-sm text-gray-600 italic">
                              Note: {expense.note}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() =>
                              handleEditExpenseClick(
                                expense,
                                viewExpensesModalBudget.id
                              )
                            }
                            className="text-blue-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteExpense(
                                expense.id,
                                viewExpensesModalBudget.id
                              )
                            }
                            className="text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                )
              )}
            </ul>
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                onClick={() => setViewExpensesModalBudget(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetsPage;
