import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [newSpent, setNewSpent] = useState<number>(0);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/budgets');
        if (!res.ok) {
          throw new Error('Failed to fetch budgets');
        }
        const data = await res.json();
        console.log('Fetched Budgets:', data);

        if (Array.isArray(data) && Array.isArray(data[0])) {
          setBudgets(data[0]);
          setFilteredBudgets(data[0]);
        } else if (Array.isArray(data)) {
          setBudgets(data);
          setFilteredBudgets(data);
        } else {
          setError('Invalid data format received from server.');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching budgets:', err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }

        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  // Filter budgets by search input
  useEffect(() => {
    const filtered = budgets.filter((budget) =>
      budget.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredBudgets(filtered);
  }, [search, budgets]);

  // DELETE Budget Function
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5001/api/budget/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete budget');

      setBudgets((prevBudgets) => prevBudgets.filter((b) => b.id !== id));
      toast.success('Budget deleted successfully!');
    } catch (err) {
      console.error('Error deleting budget:', err);
      toast.error('Error deleting budget. Please try again.');
    }
  };

  // UPDATE Budget Function
  const handleUpdate = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5001/api/budget/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spent: newSpent }),
      });

      if (!response.ok) throw new Error('Failed to update budget');

      setBudgets((prevBudgets) =>
        prevBudgets.map((budget) =>
          budget.id === id
            ? {
                ...budget,
                spent: newSpent,
                remaining: budget.budget - newSpent,
              }
            : budget
        )
      );
      setEditingId(null);
      toast.success('Budget updated successfully!');
    } catch (err) {
      console.error('Error updating budget:', err);
      toast.error('Error updating budget. Please try again.');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4f46e5" size={60} /> {/* ✅ Loading Spinner */}
      </div>
    );

  if (error) return <p>Error: {error}</p>;

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

      <ul className="space-y-4">
        {filteredBudgets.map((budget) => (
          <li
            key={budget.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-purple-700">
              {budget.title}
            </h2>
            <p className="text-gray-600">
              Budget: ${Number(budget.budget).toFixed(2)}
            </p>
            <p className="text-gray-600">
              Spent: ${Number(budget.spent).toFixed(2)}
            </p>
            <p className="text-gray-600">
              Remaining: ${Number(budget.remaining).toFixed(2)}
            </p>

            {editingId === budget.id ? (
              <div className="mt-2">
                <input
                  type="number"
                  value={newSpent}
                  onChange={(e) => setNewSpent(Number(e.target.value))}
                  className="p-2 border rounded w-1/2"
                />
                <button
                  onClick={() => handleUpdate(budget.id)}
                  className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setEditingId(budget.id);
                  setNewSpent(budget.spent);
                }}
                className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700"
              >
                Edit Spent
              </button>
            )}

            <button
              onClick={() => handleDelete(budget.id)}
              className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BudgetsPage;
