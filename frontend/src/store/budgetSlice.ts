import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import budgetService from '../services/budgetService';
import { AxiosError } from 'axios';

export interface Budget {
  id: number;
  title: string;
  budget: number;
  spent: number;
  remaining: number;
  created_at: string;
  owner?: string;
  responsible?: string;
}

interface BudgetState {
  items: Budget[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchBudgets = createAsyncThunk(
  'budget/fetchBudgets',
  async (_, { rejectWithValue }) => {
    try {
      const budgets = await budgetService.getBudgets();
      return budgets;
    } catch (err: unknown) {
      // Type guard
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data || 'Failed to fetch budgets');
      }
      return rejectWithValue('Failed to fetch budgets');
    }
  }
);

export const updateBudgetThunk = createAsyncThunk(
  'budget/updateBudget',
  async (
    { id, updatedData }: { id: number; updatedData: Partial<Budget> },
    { rejectWithValue }
  ) => {
    try {
      const updatedBudget = await budgetService.updateBudget(id, updatedData);
      return updatedBudget;
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data || 'Failed to update budget');
      }
      return rejectWithValue('Failed to update budget');
    }
  }
);

export const deleteBudgetThunk = createAsyncThunk(
  'budget/deleteBudget',
  async (id: number, { rejectWithValue }) => {
    try {
      await budgetService.deleteBudget(id);
      return id;
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data || 'Failed to delete budget');
      }
      return rejectWithValue('Failed to delete budget');
    }
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBudgetThunk.fulfilled, (state, action) => {
        state.items = state.items.map((b) =>
          b.id === action.payload.id ? action.payload : b
        );
      })
      .addCase(deleteBudgetThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload);
      });
  },
});

export default budgetSlice.reducer;
