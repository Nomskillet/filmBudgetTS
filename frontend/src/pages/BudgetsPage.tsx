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
    budget: '',
    spent: '',
  });
  const [search, setSearch] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
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
      } else {
        setError('Invalid data format received from server.');
      }

      setLoading(false);
    };

    fetchBudgets();
  }, [navigate]);

  useEffect(() => {
    setFilteredBudgets(
      budgets.filter((budget) =>
        budget.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, budgets]);

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

  const handleEditClick = (budget: Budget) => {
    setEditingId(budget.id);
    setEditData({
      title: budget.title,
      budget: budget.budget.toString(),
      spent: budget.spent.toString(),
    });
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
      spent: parseFloat(editData.spent.replace(/^0+(?!$)/, '')) || 0,
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
              spent: requestBody.spent,
              remaining: requestBody.budget - requestBody.spent,
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

                <label className="block text-gray-700 font-semibold">
                  Amount Spent:
                </label>
                <input
                  type="text"
                  value={editData.spent}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      spent: e.target.value.replace(/^0+(?!$)/, ''),
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
                  Spent: ${Number(budget.spent).toFixed(2)}
                </p>
                <p className="text-gray-600">
                  Remaining: ${Number(budget.remaining).toFixed(2)}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditClick(budget)}
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
