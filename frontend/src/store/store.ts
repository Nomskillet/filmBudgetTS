import { configureStore } from '@reduxjs/toolkit';
import budgetReducer from './budgetSlice';
import expenseReducer from './expenseSlice';
import counterReducer from './counterSlice';
import { budgetApi } from './budgetApi';

export const store = configureStore({
  reducer: {
    budget: budgetReducer,
    expense: expenseReducer,
    counter: counterReducer,
    [budgetApi.reducerPath]: budgetApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(budgetApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
