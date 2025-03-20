import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';

interface Budget {
  id: number;
  title: string;
  budget: number;
  spent: number;
  remaining: number;
  created_at: string;
}

function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [filteredBudgets, setFilteredBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    title: '',
    budget: '0', // Start as a string, convert to number later
    spent: '0', // Ensure spent is included and starts as a string
  });
  const [search, setSearch] = useState<string>('');

  const [expenses, setExpenses] = useState<{
    [key: number]: {
      id: number;
      description: string;
      amount: string;
      created_at: string;
    }[];
  }>({});

  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [editExpenseData, setEditExpenseData] = useState({
    description: '',
    amount: '',
  });

  const [activeBudget, setActiveBudget] = useState<number | null>(null);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<number | null>(
    null
  );

  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
  });

  const navigate = useNavigate();

  const fetchExpenses = async (budgetId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(`http://localhost:5001/api/expenses/${budgetId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return;

    const data = await res.json();
    setExpenses((prev) => ({ ...prev, [budgetId]: data }));
  };

  const fetchBudgets = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in.');
      setLoading(false);
      return;
    }

    const res = await fetch('http://localhost:5001/api/budgets', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      setLoading(false);
      setError(
        res.status === 401
          ? 'Unauthorized: Please log in again.'
          : 'Failed to fetch budgets'
      );
      return;
    }

    const data = await res.json();
    if (Array.isArray(data)) {
      setBudgets(data);
      setFilteredBudgets(data);

      // Fetch expenses for each budget
      data.forEach((budget) => fetchExpenses(budget.id));
    } else {
      setError('Invalid data format received from server.');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBudgets();
  }, [navigate]);

  useEffect(() => {
    setFilteredBudgets(
      budgets.filter((budget) =>
        budget.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, budgets]);

  const handleViewExpenses = async (budgetId: number) => {
    if (activeBudget === budgetId) {
      setActiveBudget(null); // Close expenses if already open
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized request');
      return;
    }

    // Make sure the API route matches your backend
    const res = await fetch(`http://localhost:5001/api/expenses/${budgetId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      toast.error('Failed to load expenses.');
      return;
    }

    const data = await res.json();
    console.log('Expenses for budget:', budgetId, data);

    setExpenses((prev) => ({ ...prev, [budgetId]: data }));
    setActiveBudget(budgetId); // Open expenses for this budget
  };

  const handleAddExpense = async () => {
    if (!showAddExpenseModal) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized request');
      return;
    }

    const response = await fetch(
      `http://localhost:5001/api/budget/${showAddExpenseModal}/expense`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: newExpense.description,
          amount: parseFloat(newExpense.amount),
        }),
      }
    );

    if (!response.ok) {
      toast.error('Failed to add expense.');
      return;
    }

    toast.success('Expense added successfully!');

    // Clear the input fields
    setNewExpense({ description: '', amount: '' });

    // Close the modal
    setShowAddExpenseModal(null);

    // Refresh budgets (spent + remaining)
    fetchBudgets(); // Make sure fetchBudgets fetches updated spent & remaining
  };

  const handleEditExpenseClick = (expense: {
    id: number;
    description: string;
    amount: string;
  }) => {
    setEditingExpenseId(expense.id);
    setEditExpenseData({
      description: expense.description,
      amount: expense.amount.toString(),
    });
  };

  const handleUpdateExpense = async () => {
    if (!editingExpenseId) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized request');
      return;
    }

    const response = await fetch(
      `http://localhost:5001/api/expense/${editingExpenseId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: editExpenseData.description,
          amount: parseFloat(editExpenseData.amount),
        }),
      }
    );

    if (!response.ok) {
      toast.error('Failed to update expense');
      return;
    }

    const updatedExpense = await response.json();

    // Update the expenses in state
    setExpenses((prevExpenses) => {
      const updatedExpenses = prevExpenses[activeBudget!].map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      );

      return {
        ...prevExpenses,
        [activeBudget!]: updatedExpenses,
      };
    });

    // ✅ Recalculate the new spent amount
    const prevExpense = expenses[activeBudget!].find(
      (expense) => expense.id === updatedExpense.id
    );
    const prevAmount = prevExpense ? parseFloat(prevExpense.amount) : 0;
    const updatedSpent =
      budgets.find((b) => b.id === activeBudget)!.spent -
      prevAmount +
      parseFloat(editExpenseData.amount);

    // Update the budget's spent & remaining values
    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) => {
        if (budget.id === activeBudget) {
          return {
            ...budget,
            spent: updatedSpent,
            remaining: budget.budget - updatedSpent,
          };
        }
        return budget;
      })
    );

    setEditingExpenseId(null);
    toast.success('Expense updated successfully!');
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized request');
      return;
    }

    const response = await fetch(`http://localhost:5001/api/budget/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      toast.error('Failed to delete budget');
      return;
    }

    setBudgets((prevBudgets) => prevBudgets.filter((b) => b.id !== id));
    toast.success('Budget deleted successfully!');
  };

  // const handleEditClick = (budget: Budget) => {
  //   setEditingId(budget.id);
  //   setEditData({
  //     title: budget.title,
  //     budget: budget.budget.toString(),
  //     spent: budget.spent?.toString() || "0",
  //   });
  // };

  const handleDeleteExpense = async (expenseId: number, budgetId: number) => {
    console.log(`Deleting expense: ${expenseId} from budget: ${budgetId}`);

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized request');
      return;
    }

    const response = await fetch(
      `http://localhost:5001/api/expense/${expenseId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorMsg = await response.text();
      console.error('Delete failed:', errorMsg);
      toast.error(`Failed to delete expense: ${errorMsg}`);
      return;
    }

    toast.success('Expense deleted successfully!');

    setExpenses((prevExpenses) => ({
      ...prevExpenses,
      [budgetId]: prevExpenses[budgetId].filter((exp) => exp.id !== expenseId),
    }));

    fetchBudgets();
  };

  const handleUpdate = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized request');
      return;
    }

    const requestBody = {
      title: editData.title,
      budget: parseFloat(editData.budget.replace(/^0+(?!$)/, '')) || 0,
      spent: parseFloat(editData.spent.replace(/^0+(?!$)/, '')) || 0, // Convert spent to a number
    };

    console.log('Sending update request with:', requestBody);

    const response = await fetch(`http://localhost:5001/api/budget/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();
    console.log('Server response:', responseData);

    if (!response.ok) {
      toast.error(
        `Failed to update budget: ${JSON.stringify(responseData.errors)}`
      );
      return;
    }

    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget.id === id
          ? {
              ...budget,
              title: requestBody.title,
              budget: requestBody.budget,
              spent: isNaN(Number(budget.spent)) ? 0 : Number(budget.spent),
              remaining:
                requestBody.budget -
                (isNaN(Number(budget.spent)) ? 0 : Number(budget.spent)),
            }
          : budget
      )
    );

    setEditingId(null);
    toast.success('Budget updated successfully!');
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4f46e5" size={60} />
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;

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

            {/* Expense Description */}
            <input
              type="text"
              placeholder="Expense Description"
              className="border p-2 w-full mb-2 rounded"
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
            />

            {/* Expense Amount */}
            <input
              type="number"
              placeholder="Amount"
              className="border p-2 w-full mb-2 rounded"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
            />

            {/* Buttons */}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => setShowAddExpenseModal(null)}
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      <ul className="space-y-4">
        {filteredBudgets.map((budget) => (
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
                  Budget: $
                  {!isNaN(Number(budget.budget))
                    ? Number(budget.budget).toFixed(2)
                    : 0}
                </p>
                <p className="text-gray-600">
                  Spent: $
                  {!isNaN(Number(budget.spent))
                    ? Number(budget.spent).toFixed(2)
                    : '0.00'}
                </p>

                <p
                  className={`text-gray-600 ${
                    budget.budget - budget.spent < 0 ? 'text-red-500' : ''
                  }`}
                >
                  Remaining:{' '}
                  {budget.budget - budget.spent < 0
                    ? `-$${Math.abs(budget.budget - budget.spent).toFixed(2)}`
                    : `$${(budget.budget - budget.spent).toFixed(2)}`}
                </p>

                <div className="mt-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(budget.id);
                        setEditData({
                          title: budget.title,
                          budget: budget.budget.toString(),
                          spent: budget.spent?.toString() || '0',
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

                  {/* Move expenses BELOW the buttons */}
                  {activeBudget === budget.id && expenses[budget.id] && (
                    <ul className="mt-4 p-3 border rounded bg-gray-100">
                      {expenses[budget.id].length > 0 ? (
                        expenses[budget.id].map((expense) => (
                          <li
                            key={expense.id}
                            className="text-gray-700 flex justify-between items-center"
                          >
                            {editingExpenseId === expense.id ? (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={editExpenseData.description}
                                  onChange={(e) =>
                                    setEditExpenseData({
                                      ...editExpenseData,
                                      description: e.target.value,
                                    })
                                  }
                                  className="border p-1"
                                />
                                <input
                                  type="number"
                                  value={editExpenseData.amount}
                                  onChange={(e) =>
                                    setEditExpenseData({
                                      ...editExpenseData,
                                      amount: e.target.value,
                                    })
                                  }
                                  className="border p-1"
                                />
                                <button
                                  onClick={handleUpdateExpense}
                                  className="bg-green-500 text-white px-2 py-1 rounded"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingExpenseId(null)}
                                  className="bg-gray-400 text-white px-2 py-1 rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between w-full">
                                <span>
                                  {expense.description}: $
                                  {Number(expense.amount).toFixed(2)}
                                </span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleEditExpenseClick(expense)
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
                        ))
                      ) : (
                        <p className="text-gray-500">No expenses yet.</p>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BudgetsPage;
