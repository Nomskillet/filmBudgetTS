import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Expense } from './expenseSlice'; // adjust path if needed

export const expenseApi = createApi({
  reducerPath: 'expenseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5001/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Expenses'],
  endpoints: (builder) => ({
    getExpenses: builder.query<Expense[], number>({
      query: (budgetId: number) => `/expenses/${budgetId}`,
      providesTags: (result, error, budgetId) =>
        result
          ? [
              { type: 'Expenses', id: budgetId },
              { type: 'Expenses', id: 'LIST' },
            ]
          : [{ type: 'Expenses', id: budgetId }],
    }),

    getAllExpenses: builder.query<Expense[], void>({
      query: () => '/expenses',
      providesTags: [{ type: 'Expenses', id: 'LIST' }],
    }),

    addExpense: builder.mutation<
      void,
      { budgetId: number; expenseData: Partial<Expense> }
    >({
      query: ({ budgetId, expenseData }) => ({
        url: `/budget/${budgetId}/expense`,
        method: 'POST',
        body: expenseData,
      }),
      invalidatesTags: (result, error, { budgetId }) => [
        { type: 'Expenses', id: budgetId },
      ],
    }),

    updateExpense: builder.mutation<
      void,
      {
        budgetId: number;
        expenseId: number;
        expenseData: {
          description: string;
          amount: number;
          owner: string;
          responsible: string;
          place_of_purchase: string;
          purchase_date?: string;
          note: string;
          receipt_image_url?: string; // ✅ explicitly supported
        };
      }
    >({
      query: ({ budgetId, expenseId, expenseData }) => ({
        url: `/expenses/${budgetId}/${expenseId}`,
        method: 'PATCH',
        body: expenseData,
      }),
      invalidatesTags: (result, error, { budgetId }) => [
        { type: 'Expenses', id: budgetId },
      ],
    }),

    deleteExpense: builder.mutation<
      void,
      { expenseId: number; budgetId: number }
    >({
      query: ({ expenseId, budgetId }) => ({
        url: `/expenses/${budgetId}/${expenseId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Expenses', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetAllExpensesQuery,
} = expenseApi;
