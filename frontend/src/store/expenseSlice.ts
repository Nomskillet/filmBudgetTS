import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import expenseService from '../services/expenseService';
import { AxiosError } from 'axios';
import type { AddExpensePayload } from '../services/expenseService';

export interface Expense {
  id: number;
  budget_id: number;
  description: string;
  amount: number;
  created_at: string;

  owner?: string;
  responsible?: string;
  place_of_purchase?: string;
  purchase_date?: string;
  note?: string;
}

interface ExpenseState {
  // We'll store expenses keyed by budget id
  items: { [budgetId: number]: Expense[] };
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  items: {},
  loading: false,
  error: null,
};

export const fetchExpenses = createAsyncThunk(
  'expense/fetchExpenses',
  async (budgetId: number, { rejectWithValue }) => {
    try {
      const expenses = await expenseService.getExpenses(budgetId);
      return { budgetId, expenses };
    } catch (err: unknown) {
      // Type guard for AxiosError
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data || 'Failed to fetch expenses');
      }
      return rejectWithValue('Failed to fetch expenses');
    }
  }
);

export const addExpenseThunk = createAsyncThunk(
  'expense/addExpense',
  async (
    {
      budgetId,
      expenseData,
    }: {
      budgetId: number;
      expenseData: {
        description: string;
        amount: number;
        owner?: string;
        responsible?: string;
        place_of_purchase?: string;
        purchase_date?: number;
        note?: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const expense = await expenseService.addExpense(budgetId, expenseData);
      return { budgetId, expense };
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data || 'Failed to add expense');
      }
      return rejectWithValue('Failed to add expense');
    }
  }
);

export const updateExpenseThunk = createAsyncThunk(
  'expense/updateExpense',
  async (
    {
      expenseId,
      expenseData,
      budgetId,
    }: {
      expenseId: number;
      expenseData: AddExpensePayload; // ✅ Now it allows all the fields
      budgetId: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const expense = await expenseService.updateExpense(
        expenseId,
        expenseData
      );
      return { budgetId, expense };
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data || 'Failed to update expense');
      }
      return rejectWithValue('Failed to update expense');
    }
  }
);

export const deleteExpenseThunk = createAsyncThunk(
  'expense/deleteExpense',
  async (
    { expenseId, budgetId }: { expenseId: number; budgetId: number },
    { rejectWithValue }
  ) => {
    try {
      await expenseService.deleteExpense(expenseId);
      return { expenseId, budgetId };
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        return rejectWithValue(err.response.data || 'Failed to delete expense');
      }
      return rejectWithValue('Failed to delete expense');
    }
  }
);

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        const { budgetId, expenses } = action.payload as {
          budgetId: number;
          expenses: Expense[];
        };

        console.log('Fetched expenses:', expenses);
        state.items[budgetId] = expenses;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addExpenseThunk.fulfilled, (state, action) => {
        const { budgetId, expense } = action.payload as {
          budgetId: number;
          expense: Expense;
        };
        if (state.items[budgetId]) {
          state.items[budgetId].push(expense);
        } else {
          state.items[budgetId] = [expense];
        }
      })
      .addCase(updateExpenseThunk.fulfilled, (state, action) => {
        const { budgetId, expense } = action.payload as {
          budgetId: number;
          expense: Expense;
        };
        if (state.items[budgetId]) {
          state.items[budgetId] = state.items[budgetId].map((exp) =>
            exp.id === expense.id ? expense : exp
          );
        }
      })
      .addCase(deleteExpenseThunk.fulfilled, (state, action) => {
        const { expenseId, budgetId } = action.payload as {
          expenseId: number;
          budgetId: number;
        };
        if (state.items[budgetId]) {
          state.items[budgetId] = state.items[budgetId].filter(
            (exp) => exp.id !== expenseId
          );
        }
      });
  },
});

export default expenseSlice.reducer;
