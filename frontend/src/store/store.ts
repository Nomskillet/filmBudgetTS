import { configureStore } from '@reduxjs/toolkit';
import budgetReducer from './budgetSlice';
import expenseReducer from './expenseSlice';
import counterReducer from './counterSlice';

// (Other reducers such as counterReducer, if any)

export const store = configureStore({
  reducer: {
    budget: budgetReducer,
    expense: expenseReducer,
    counter: counterReducer,
    // other reducers...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
