import api from '../utils/axios';

export const getExpenses = async (budgetId: number) => {
  const response = await api.get(`/expenses/${budgetId}`);
  return response.data; // returns an array of expenses for the given budget
};

export const addExpense = async (
  budgetId: number,
  expenseData: { description: string; amount: number }
) => {
  const response = await api.post(`/budget/${budgetId}/expense`, expenseData);
  return response.data;
};

export const updateExpense = async (
  expenseId: number,
  expenseData: { description: string; amount: number }
) => {
  const response = await api.patch(`/expense/${expenseId}`, expenseData);
  return response.data;
};

export const deleteExpense = async (expenseId: number) => {
  await api.delete(`/expense/${expenseId}`);
};

export default { getExpenses, addExpense, updateExpense, deleteExpense };
