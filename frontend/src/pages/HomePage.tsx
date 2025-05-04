import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Citizen Budget', spent: 5229.12 },
  { name: 'Budget Runner', spent: 1450.5 },
  { name: 'Jurassic Costs', spent: 380 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

function HomePage() {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-purple-200 to-indigo-300 px-4 pt-20 sm:pt-24 text-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-2">
          🎬 Welcome to Film Budget Tracker
        </h1>
        <p className="text-gray-600 mb-6 text-base sm:text-lg">
          Track and manage your film budgets with ease.
        </p>

        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart key={animationKey}>
              <Pie
                data={data}
                dataKey="spent"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                fill="#8884d8"
                label
                isAnimationActive
                animationDuration={1000}
                animationBegin={0}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
