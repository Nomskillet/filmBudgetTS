import api from '../utils/axios';
import type { Budget } from '../store/budgetSlice'; // 1️⃣ Import Budget from budgetSlice

export const getBudgets = async () => {
  const response = await api.get('/budgets');
  return response.data; // returns an array of budgets
};

export const updateBudget = async (id: number, updateData: Partial<Budget>) => {
  const response = await api.patch(`/budget/${id}`, updateData);
  return response.data; // returns the updated budget
};

export const deleteBudget = async (id: number) => {
  await api.delete(`/budget/${id}`);
};

export default { getBudgets, updateBudget, deleteBudget };
