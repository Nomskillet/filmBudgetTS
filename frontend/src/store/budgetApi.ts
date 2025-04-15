import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Budget } from './budgetSlice';

export const budgetApi = createApi({
  reducerPath: 'budgetApi',
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

  tagTypes: ['Budgets'],
  endpoints: (builder) => ({
    getBudgets: builder.query<Budget[], void>({
      query: () => '/budgets',
      providesTags: ['Budgets'],
    }),
    addBudget: builder.mutation<
      void,
      {
        budgets: {
          title: string;
          budget: number;
          owner?: string;
          responsible?: string;
        }[];
      }
    >({
      query: (data) => ({
        url: '/budget',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Budgets'],
    }),

    updateBudget: builder.mutation<
      void,
      { id: number; updatedData: Partial<Budget> }
    >({
      query: ({ id, updatedData }) => ({
        url: `/budget/${id}`,
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['Budgets'],
    }),
    deleteBudget: builder.mutation<void, number>({
      query: (id) => ({
        url: `/budget/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Budgets'],
    }),
  }),
});

export const {
  useDeleteBudgetMutation,
  useUpdateBudgetMutation,
  useAddBudgetMutation,
  useGetBudgetsQuery,
} = budgetApi;
