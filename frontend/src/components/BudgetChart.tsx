import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const sampleData = [
  { name: 'Project A', budget: 5000, spent: 3200 },
  { name: 'Project B', budget: 8000, spent: 4500 },
  { name: 'Project C', budget: 3000, spent: 3000 },
];

const BudgetChart: React.FC = () => {
  return (
    <div className="w-full h-96 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sampleData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="budget" fill="#8884d8" />
          <Bar dataKey="spent" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetChart;
