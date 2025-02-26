import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetch("http://localhost:5001/api/budgets") // ✅ Make sure this matches your backend route
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

  if (loading) return <p>Loading budgets...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
<div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
  <h1 className="text-3xl font-bold text-gray-800 mb-4">Budget Dashboard</h1>
  <ul className="space-y-4">
    {budgets.map((budget) => (
      <li key={budget.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
        <h2 className="text-xl font-semibold text-purple-700">{budget.title}</h2>
        <p className="text-gray-600">Budget: ${budget.budget}</p>
        <p className="text-gray-600">Spent: ${budget.spent}</p>
        <p className="text-gray-600">Remaining: ${budget.remaining}</p>
      </li>
    ))}
  </ul>
</div>

  );
}

export default BudgetsPage;
