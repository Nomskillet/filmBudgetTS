// import api from '../utils/axios';

// export const getExpenses = async (budgetId: number) => {
//   const response = await api.get(`/expenses/${budgetId}`);
//   return response.data; // returns an array of expenses for the given budget
// };

// export const addExpense = async (
//   budgetId: number,
//   expenseData: { description: string; amount: number }
// ) => {
//   const response = await api.post(`/budget/${budgetId}/expense`, expenseData);
//   return response.data;
// };

// export const updateExpense = async (
//   expenseId: number,
//   expenseData: { description: string; amount: number }
// ) => {
//   const response = await api.patch(`/expense/${expenseId}`, expenseData);
//   return response.data;
// };

// export const deleteExpense = async (expenseId: number) => {
//   await api.delete(`/expense/${expenseId}`);
// };

// export default { getExpenses, addExpense, updateExpense, deleteExpense };

import api from '../utils/axios';

// ✅ Define a shared type for adding/updating an expense
export interface AddExpensePayload {
  description: string;
  amount: number;
  owner?: string;
  responsible?: string;
  place_of_purchase?: string;
  purchase_date?: number; // Unix timestamp (epoch)
  note?: string;
}

// ✅ Get all expenses for a specific budget
const getExpenses = async (budgetId: number) => {
  const response = await api.get(`/expenses/${budgetId}`);
  return response.data;
};

// ✅ Add a new expense with metadata
const addExpense = async (budgetId: number, expenseData: AddExpensePayload) => {
  const response = await api.post(`/budget/${budgetId}/expense`, expenseData);
  return response.data;
};

// ✅ Update an existing expense with metadata
const updateExpense = async (
  expenseId: number,
  expenseData: AddExpensePayload
) => {
  const response = await api.patch(`/expense/${expenseId}`, expenseData);
  return response.data;
};

// ✅ Delete an expense
const deleteExpense = async (expenseId: number) => {
  const response = await api.delete(`/expense/${expenseId}`);
  return response.data;
};

const expenseService = {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
};

export default expenseService;
