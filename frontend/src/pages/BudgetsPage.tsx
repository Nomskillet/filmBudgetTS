import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newSpent, setNewSpent] = useState<number>(0);

  useEffect(() => {
    fetch("http://localhost:5001/api/budgets")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch budgets");
        }
        return res.json();
      })
      .then((data) => {
        setBudgets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching budgets:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // ✅ DELETE Budget Function
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5001/api/budget/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete budget");

      // ✅ Remove the deleted budget from state
      setBudgets((prevBudgets) => prevBudgets.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error deleting budget:", err);
    }
  };

  // ✅ UPDATE Budget Function
  const handleUpdate = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5001/api/budget/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spent: newSpent }),
      });

      if (!response.ok) throw new Error("Failed to update budget");

      // ✅ Update budget in state
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

      setEditingId(null); // ✅ Close edit mode after updating
    } catch (err) {
      console.error("Error updating budget:", err);
    }
  };

  if (loading) return <p>Loading budgets...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Budget Dashboard</h1>
        <Link to="/add-budget">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md">
            + Add Budget
          </button>
        </Link>
      </div>

      <ul className="space-y-4">
        {budgets.map((budget) => (
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

            {/* ✅ EDIT MODE */}
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
                  setNewSpent(budget.spent); // ✅ Set input field to the actual spent amount
                }}
                className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700"
              >
                Edit Spent
              </button>
            )}

            {/* ✅ DELETE BUTTON */}
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
