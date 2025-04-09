// TestExpenses.tsx
import React from 'react';
import { useGetExpensesQuery } from '../store/expenseApi';

function TestExpenses() {
  const BUDGET_ID = 102; // or whichever budget ID you tested with cURL

  const {
    data: expenses,
    isLoading,
    isError,
    error,
  } = useGetExpensesQuery(BUDGET_ID);

  if (isLoading) {
    return <p>Loading expenses...</p>;
  }
  if (isError) {
    return <p style={{ color: 'red' }}>Error: {JSON.stringify(error)}</p>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Test Expenses for Budget {BUDGET_ID}</h2>
      {expenses && expenses.length > 0 ? (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              {expense.description} - ${expense.amount}
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses found for this budget ID.</p>
      )}
    </div>
  );
}

export default TestExpenses;
