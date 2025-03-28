// import { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import ClipLoader from 'react-spinners/ClipLoader';
// import api from '../utils/axios';

// interface Budget {
//   id: number;
//   title: string;
//   budget: number;
//   spent: number;
//   remaining: number;
//   created_at: string;
// }

// function BudgetsPage() {
//   const [budgets, setBudgets] = useState<Budget[]>([]);
//   const [filteredBudgets, setFilteredBudgets] = useState<Budget[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [editData, setEditData] = useState({
//     title: '',
//     budget: '0',
//     spent: '0',
//   });
//   const [search, setSearch] = useState<string>('');

//   const [expenses, setExpenses] = useState<{
//     [key: number]: {
//       id: number;
//       description: string;
//       amount: string;
//       created_at: string;
//     }[];
//   }>({});

//   const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
//   const [editExpenseData, setEditExpenseData] = useState({
//     description: '',
//     amount: '',
//   });

//   const [activeBudget, setActiveBudget] = useState<number | null>(null);
//   const [showAddExpenseModal, setShowAddExpenseModal] = useState<number | null>(
//     null
//   );

//   const [newExpense, setNewExpense] = useState({
//     description: '',
//     amount: '',
//   });

//   const navigate = useNavigate();

//   const fetchExpenses = async (budgetId: number) => {
//     try {
//       const response = await api.get(`/expenses/${budgetId}`);
//       const data = response.data;

//       setExpenses((prev) => ({ ...prev, [budgetId]: data }));
//     } catch (error) {
//       console.error(`Failed to fetch expenses for budget ${budgetId}:`, error);
//     }
//   };

//   const fetchBudgets = async () => {
//     try {
//       const response = await api.get('/budgets');
//       const data = response.data;

//       if (Array.isArray(data)) {
//         setBudgets(data);
//         setFilteredBudgets(data);

//         // Fetch expenses for each budget
//         data.forEach((budget) => fetchExpenses(budget.id));
//       } else {
//         setError('Invalid data format received from server.');
//       }
//     } catch (error: unknown) {
//       if (
//         error &&
//         typeof error === 'object' &&
//         'response' in error &&
//         error.response &&
//         typeof error.response === 'object' &&
//         'status' in error.response
//       ) {
//         const err = error as { response: { status: number } };
//         if (err.response.status === 401) {
//           setError('Unauthorized: Please log in again.');
//         } else {
//           setError('Failed to fetch budgets');
//         }
//       } else {
//         setError('Something went wrong');
//       }
//     } finally {
//       // ✅ THIS LINE IS CRUCIAL!
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBudgets();
//   }, [navigate]);

//   useEffect(() => {
//     setFilteredBudgets(
//       budgets.filter((budget) =>
//         budget.title.toLowerCase().includes(search.toLowerCase())
//       )
//     );
//   }, [search, budgets]);

//   const handleViewExpenses = async (budgetId: number) => {
//     if (activeBudget === budgetId) {
//       setActiveBudget(null); // Toggle off
//       return;
//     }

//     try {
//       const response = await api.get(`/expenses/${budgetId}`);
//       const data = response.data;

//       setExpenses((prev) => ({ ...prev, [budgetId]: data }));
//       setActiveBudget(budgetId);
//     } catch (error) {
//       console.error('View expenses error:', error);
//       toast.error('Failed to load expenses.');
//     }
//   };

//   const handleAddExpense = async () => {
//     if (!showAddExpenseModal) return;

//     try {
//       await api.post(`/budget/${showAddExpenseModal}/expense`, {
//         description: newExpense.description,
//         amount: parseFloat(newExpense.amount),
//       });

//       toast.success('Expense added successfully!');

//       setNewExpense({ description: '', amount: '' });
//       setShowAddExpenseModal(null);
//       fetchBudgets();
//     } catch (error) {
//       console.error('Error adding expense:', error);
//       toast.error('Failed to add expense.');
//     }
//   };

//   const handleEditExpenseClick = (expense: {
//     id: number;
//     description: string;
//     amount: string;
//   }) => {
//     setEditingExpenseId(expense.id);
//     setEditExpenseData({
//       description: expense.description,
//       amount: expense.amount.toString(),
//     });
//   };

//   const handleUpdateExpense = async () => {
//     if (!editingExpenseId) return;

//     try {
//       const response = await api.patch(`/expense/${editingExpenseId}`, {
//         description: editExpenseData.description,
//         amount: parseFloat(editExpenseData.amount),
//       });

//       const updatedExpense = response.data;

//       setExpenses((prevExpenses) => {
//         const updatedExpenses = prevExpenses[activeBudget!].map((expense) =>
//           expense.id === updatedExpense.id ? updatedExpense : expense
//         );

//         return {
//           ...prevExpenses,
//           [activeBudget!]: updatedExpenses,
//         };
//       });

//       const prevExpense = expenses[activeBudget!].find(
//         (expense) => expense.id === updatedExpense.id
//       );
//       const prevAmount = prevExpense ? parseFloat(prevExpense.amount) : 0;
//       const updatedSpent =
//         budgets.find((b) => b.id === activeBudget)!.spent -
//         prevAmount +
//         parseFloat(editExpenseData.amount);

//       setBudgets((prevBudgets) =>
//         prevBudgets.map((budget) =>
//           budget.id === activeBudget
//             ? {
//                 ...budget,
//                 spent: updatedSpent,
//                 remaining: budget.budget - updatedSpent,
//               }
//             : budget
//         )
//       );

//       setEditingExpenseId(null);
//       toast.success('Expense updated successfully!');
//     } catch (error) {
//       console.error('Update expense error:', error);
//       toast.error('Failed to update expense');
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await api.delete(`/budget/${id}`);

//       setBudgets((prevBudgets) => prevBudgets.filter((b) => b.id !== id));
//       toast.success('Budget deleted successfully!');
//     } catch (error) {
//       console.error('Delete budget error:', error);
//       toast.error('Failed to delete budget');
//     }
//   };

//   // const handleEditClick = (budget: Budget) => {
//   //   setEditingId(budget.id);
//   //   setEditData({
//   //     title: budget.title,
//   //     budget: budget.budget.toString(),
//   //     spent: budget.spent?.toString() || "0",
//   //   });
//   // };

//   const handleDeleteExpense = async (expenseId: number, budgetId: number) => {
//     console.log(`Deleting expense: ${expenseId} from budget: ${budgetId}`);

//     try {
//       await api.delete(`/expense/${expenseId}`);

//       toast.success('Expense deleted successfully!');

//       setExpenses((prevExpenses) => ({
//         ...prevExpenses,
//         [budgetId]: prevExpenses[budgetId].filter(
//           (exp) => exp.id !== expenseId
//         ),
//       }));

//       fetchBudgets();
//     } catch (error: unknown) {
//       const err = error as {
//         response?: { data?: { error?: string }; status?: number };
//       };
//       const message = err.response?.data?.error || 'Failed to delete expense';
//       console.error('Delete failed:', error);
//       toast.error(message);
//     }
//   };

//   const handleUpdate = async (id: number) => {
//     const requestBody = {
//       title: editData.title,
//       budget: parseFloat(editData.budget.replace(/^0+(?!$)/, '')) || 0,
//       spent: parseFloat(editData.spent.replace(/^0+(?!$)/, '')) || 0,
//     };

//     console.log('Sending update request with:', requestBody);

//     try {
//       const response = await api.patch(`/budget/${id}`, requestBody);
//       const responseData = response.data;
//       console.log('Server response:', responseData);

//       setBudgets((prevBudgets) =>
//         prevBudgets.map((budget) =>
//           budget.id === id
//             ? {
//                 ...budget,
//                 title: requestBody.title,
//                 budget: requestBody.budget,
//                 spent: isNaN(Number(budget.spent)) ? 0 : Number(budget.spent),
//                 remaining:
//                   requestBody.budget -
//                   (isNaN(Number(budget.spent)) ? 0 : Number(budget.spent)),
//               }
//             : budget
//         )
//       );

//       setEditingId(null);
//       toast.success('Budget updated successfully!');
//     } catch (error: unknown) {
//       const err = error as {
//         response?: { data?: { errors?: string | Record<string, string> } };
//       };
//       console.error('Update error:', error);
//       toast.error(
//         `Failed to update budget: ${JSON.stringify(err.response?.data?.errors)}`
//       );
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <ClipLoader color="#4f46e5" size={60} />
//       </div>
//     );

//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold text-gray-800">Budget Dashboard</h1>
//         <Link to="/add-budget">
//           <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
//             + Add Budget
//           </button>
//         </Link>
//       </div>

//       <input
//         type="text"
//         placeholder="Search budgets..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="mb-4 p-2 border rounded w-full"
//       />

//       {showAddExpenseModal !== null && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-bold mb-4">Add Expense</h2>

//             {/* Expense Description */}
//             <input
//               type="text"
//               placeholder="Expense Description"
//               className="border p-2 w-full mb-2 rounded"
//               value={newExpense.description}
//               onChange={(e) =>
//                 setNewExpense({ ...newExpense, description: e.target.value })
//               }
//             />

//             {/* Expense Amount */}
//             <input
//               type="number"
//               placeholder="Amount"
//               className="border p-2 w-full mb-2 rounded"
//               value={newExpense.amount}
//               onChange={(e) =>
//                 setNewExpense({ ...newExpense, amount: e.target.value })
//               }
//             />

//             {/* Buttons */}
//             <div className="flex justify-end space-x-2 mt-4">
//               <button
//                 className="px-4 py-2 bg-gray-400 text-white rounded"
//                 onClick={() => setShowAddExpenseModal(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddExpense}
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//               >
//                 Add Expense
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <ul className="space-y-4">
//         {filteredBudgets.map((budget) => (
//           <li
//             key={budget.id}
//             className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
//           >
//             {editingId === budget.id ? (
//               <div className="space-y-2">
//                 <label className="block text-gray-700 font-semibold">
//                   Budget Name:
//                 </label>
//                 <input
//                   type="text"
//                   value={editData.title}
//                   onChange={(e) =>
//                     setEditData({ ...editData, title: e.target.value })
//                   }
//                   className="p-2 border rounded w-full"
//                 />

//                 <label className="block text-gray-700 font-semibold">
//                   Total Budget Amount:
//                 </label>
//                 <input
//                   type="text"
//                   value={editData.budget}
//                   onChange={(e) =>
//                     setEditData({
//                       ...editData,
//                       budget: e.target.value.replace(/^0+(?!$)/, ''),
//                     })
//                   }
//                   className="p-2 border rounded w-full"
//                 />

//                 <div className="flex gap-2 mt-2">
//                   <button
//                     onClick={() => handleUpdate(budget.id)}
//                     className="px-4 py-2 bg-blue-500 text-white rounded"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={() => setEditingId(null)}
//                     className="px-4 py-2 bg-gray-400 text-white rounded"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div>
//                 <h2 className="text-xl font-semibold text-purple-700">
//                   {budget.title}
//                 </h2>
//                 <p className="text-gray-600">
//                   Budget: $
//                   {!isNaN(Number(budget.budget))
//                     ? Number(budget.budget).toFixed(2)
//                     : 0}
//                 </p>
//                 <p className="text-gray-600">
//                   Spent: $
//                   {!isNaN(Number(budget.spent))
//                     ? Number(budget.spent).toFixed(2)
//                     : '0.00'}
//                 </p>

//                 <p
//                   className={`text-gray-600 ${
//                     budget.budget - budget.spent < 0 ? 'text-red-500' : ''
//                   }`}
//                 >
//                   Remaining:{' '}
//                   {budget.budget - budget.spent < 0
//                     ? `-$${Math.abs(budget.budget - budget.spent).toFixed(2)}`
//                     : `$${(budget.budget - budget.spent).toFixed(2)}`}
//                 </p>

//                 <div className="mt-2">
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => {
//                         setEditingId(budget.id);
//                         setEditData({
//                           title: budget.title,
//                           budget: budget.budget.toString(),
//                           spent: budget.spent?.toString() || '0',
//                         });
//                       }}
//                       className="px-4 py-2 bg-yellow-500 text-white rounded"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => handleDelete(budget.id)}
//                       className="px-4 py-2 bg-red-500 text-white rounded"
//                     >
//                       Delete
//                     </button>

//                     <button
//                       onClick={() => handleViewExpenses(budget.id)}
//                       className="px-4 py-2 bg-blue-500 text-white rounded"
//                     >
//                       View Expenses
//                     </button>
//                     <button
//                       onClick={() => setShowAddExpenseModal(budget.id)}
//                       className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
//                     >
//                       + Add Expense
//                     </button>
//                   </div>

//                   {/* Move expenses BELOW the buttons */}
//                   {activeBudget === budget.id && expenses[budget.id] && (
//                     <ul className="mt-4 p-3 border rounded bg-gray-100">
//                       {expenses[budget.id].length > 0 ? (
//                         expenses[budget.id].map((expense) => (
//                           <li
//                             key={expense.id}
//                             className="text-gray-700 flex justify-between items-center"
//                           >
//                             {editingExpenseId === expense.id ? (
//                               <div className="flex gap-2">
//                                 <input
//                                   type="text"
//                                   value={editExpenseData.description}
//                                   onChange={(e) =>
//                                     setEditExpenseData({
//                                       ...editExpenseData,
//                                       description: e.target.value,
//                                     })
//                                   }
//                                   className="border p-1"
//                                 />
//                                 <input
//                                   type="number"
//                                   value={editExpenseData.amount}
//                                   onChange={(e) =>
//                                     setEditExpenseData({
//                                       ...editExpenseData,
//                                       amount: e.target.value,
//                                     })
//                                   }
//                                   className="border p-1"
//                                 />
//                                 <button
//                                   onClick={handleUpdateExpense}
//                                   className="bg-green-500 text-white px-2 py-1 rounded"
//                                 >
//                                   Save
//                                 </button>
//                                 <button
//                                   onClick={() => setEditingExpenseId(null)}
//                                   className="bg-gray-400 text-white px-2 py-1 rounded"
//                                 >
//                                   Cancel
//                                 </button>
//                               </div>
//                             ) : (
//                               <div className="flex items-center justify-between w-full">
//                                 <span>
//                                   {expense.description}: $
//                                   {Number(expense.amount).toFixed(2)}
//                                 </span>
//                                 <div className="flex gap-2">
//                                   <button
//                                     onClick={() =>
//                                       handleEditExpenseClick(expense)
//                                     }
//                                     className="text-blue-500"
//                                   >
//                                     Edit
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       handleDeleteExpense(expense.id, budget.id)
//                                     }
//                                     className="text-red-500"
//                                   >
//                                     Delete
//                                   </button>
//                                 </div>
//                               </div>
//                             )}
//                           </li>
//                         ))
//                       ) : (
//                         <p className="text-gray-500">No expenses yet.</p>
//                       )}
//                     </ul>
//                   )}
//                 </div>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default BudgetsPage;

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchBudgets,
  updateBudgetThunk,
  deleteBudgetThunk,
} from '../store/budgetSlice';
import {
  fetchExpenses,
  addExpenseThunk,
  updateExpenseThunk,
  deleteExpenseThunk,
} from '../store/expenseSlice';

export interface Budget {
  id: number;
  title: string;
  budget: number;
  spent: number;
  remaining: number;
  created_at: string;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  created_at: string;
}

function BudgetsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    items: budgets,
    loading,
    error,
  } = useAppSelector((state) => state.budget);
  const expenseState = useAppSelector((state) => state.expense);

  const [filteredBudgets, setFilteredBudgets] = useState<Budget[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    title: '',
    budget: '0',
    spent: '0',
  });
  const [search, setSearch] = useState<string>('');

  const [activeBudget, setActiveBudget] = useState<number | null>(null);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<number | null>(
    null
  );
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [editExpenseData, setEditExpenseData] = useState({
    description: '',
    amount: '',
  });

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch, navigate]);

  useEffect(() => {
    setFilteredBudgets(
      budgets.filter((budget) =>
        budget.title.toLowerCase().includes(search.toLowerCase())
      )
    );
    budgets.forEach((b) => dispatch(fetchExpenses(b.id)));
  }, [search, budgets, dispatch]);

  const handleViewExpenses = (budgetId: number) => {
    setActiveBudget(activeBudget === budgetId ? null : budgetId);
  };

  const handleAddExpense = () => {
    if (!showAddExpenseModal) return;
    dispatch(
      addExpenseThunk({
        budgetId: showAddExpenseModal,
        expenseData: {
          description: newExpense.description,
          amount: parseFloat(newExpense.amount),
        },
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Expense added successfully!');
        setNewExpense({ description: '', amount: '' });
        dispatch(fetchExpenses(showAddExpenseModal));
        setShowAddExpenseModal(null);
      })
      .catch((err) => {
        console.error('Add expense error:', err);
        toast.error('Failed to add expense');
      });
  };

  const handleEditExpenseClick = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setEditExpenseData({
      description: expense.description,
      amount: expense.amount.toString(),
    });
  };

  const handleUpdateExpense = () => {
    if (!editingExpenseId || activeBudget === null) return;
    dispatch(
      updateExpenseThunk({
        expenseId: editingExpenseId,
        expenseData: {
          description: editExpenseData.description,
          amount: parseFloat(editExpenseData.amount),
        },
        budgetId: activeBudget,
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Expense updated successfully!');
        setEditingExpenseId(null);
        dispatch(fetchExpenses(activeBudget));
      })
      .catch(() => toast.error('Failed to update expense'));
  };

  const handleDeleteExpense = (expenseId: number, budgetId: number) => {
    dispatch(deleteExpenseThunk({ expenseId, budgetId }))
      .unwrap()
      .then(() => {
        toast.success('Expense deleted successfully!');
        dispatch(fetchExpenses(budgetId));
      })
      .catch(() => toast.error('Failed to delete expense'));
  };

  const handleUpdate = (id: number) => {
    const requestBody = {
      title: editData.title,
      budget: parseFloat(editData.budget.replace(/^0+(?!$)/, '')) || 0,
      spent: parseFloat(editData.spent.replace(/^0+(?!$)/, '')) || 0,
    };
    dispatch(updateBudgetThunk({ id, updatedData: requestBody }))
      .unwrap()
      .then(() => {
        toast.success('Budget updated successfully!');
        setEditingId(null);
        dispatch(fetchBudgets());
      })
      .catch(() => toast.error('Failed to update budget'));
  };

  const handleDelete = (id: number) => {
    dispatch(deleteBudgetThunk(id))
      .unwrap()
      .then(() => toast.success('Budget deleted successfully!'))
      .catch(() => toast.error('Failed to delete budget'));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4f46e5" size={60} />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Budget Dashboard</h1>
        <Link to="/add-budget">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            + Add Budget
          </button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search budgets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      {showAddExpenseModal !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Expense</h2>
            <input
              type="text"
              placeholder="Expense Description"
              className="border p-2 w-full mb-2 rounded"
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Amount"
              className="border p-2 w-full mb-2 rounded"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => setShowAddExpenseModal(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleAddExpense}
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      <ul className="space-y-4">
        {filteredBudgets.map((budget) => {
          const expenses = expenseState.items[budget.id] || [];
          const dynamicSpent = expenses.reduce(
            (sum, e) => sum + Number(e.amount),
            0
          );
          const dynamicRemaining = budget.budget - dynamicSpent;

          return (
            <li
              key={budget.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              {editingId === budget.id ? (
                <div className="space-y-2">
                  <label className="block text-gray-700 font-semibold">
                    Budget Name:
                  </label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                    className="p-2 border rounded w-full"
                  />
                  <label className="block text-gray-700 font-semibold">
                    Total Budget Amount:
                  </label>
                  <input
                    type="text"
                    value={editData.budget}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        budget: e.target.value.replace(/^0+(?!$)/, ''),
                      })
                    }
                    className="p-2 border rounded w-full"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleUpdate(budget.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-400 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-purple-700">
                    {budget.title}
                  </h2>
                  <p className="text-gray-600">
                    Budget: ${Number(budget.budget).toFixed(2)}
                  </p>
                  <p className="text-gray-600">
                    Spent: ${dynamicSpent.toFixed(2)}
                  </p>
                  <p
                    className={`text-gray-600 ${
                      dynamicRemaining < 0 ? 'text-red-500' : ''
                    }`}
                  >
                    Remaining:{' '}
                    {dynamicRemaining < 0
                      ? `-$${Math.abs(dynamicRemaining).toFixed(2)}`
                      : `$${dynamicRemaining.toFixed(2)}`}
                  </p>
                  <div className="mt-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(budget.id);
                          setEditData({
                            title: budget.title,
                            budget: budget.budget.toString(),
                            spent: dynamicSpent.toString(),
                          });
                        }}
                        className="px-4 py-2 bg-yellow-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleViewExpenses(budget.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                      >
                        View Expenses
                      </button>
                      <button
                        onClick={() => setShowAddExpenseModal(budget.id)}
                        className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
                      >
                        + Add Expense
                      </button>
                    </div>
                    {activeBudget === budget.id &&
                      expenseState.items[budget.id] && (
                        <ul className="mt-4 p-3 border rounded bg-gray-100">
                          {expenseState.items[budget.id].length > 0 ? (
                            expenseState.items[budget.id].map((expense) => (
                              <li
                                key={expense.id}
                                className="text-gray-700 flex justify-between items-center"
                              >
                                {editingExpenseId === expense.id ? (
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={editExpenseData.description}
                                      onChange={(e) =>
                                        setEditExpenseData({
                                          ...editExpenseData,
                                          description: e.target.value,
                                        })
                                      }
                                      className="border p-1"
                                    />
                                    <input
                                      type="number"
                                      value={editExpenseData.amount}
                                      onChange={(e) =>
                                        setEditExpenseData({
                                          ...editExpenseData,
                                          amount: e.target.value,
                                        })
                                      }
                                      className="border p-1"
                                    />
                                    <button
                                      onClick={handleUpdateExpense}
                                      className="bg-green-500 text-white px-2 py-1 rounded"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingExpenseId(null)}
                                      className="bg-gray-400 text-white px-2 py-1 rounded"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between w-full">
                                    <span>
                                      {expense.description}: $
                                      {Number(expense.amount).toFixed(2)}
                                    </span>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          handleEditExpenseClick(expense)
                                        }
                                        className="text-blue-500"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteExpense(
                                            expense.id,
                                            budget.id
                                          )
                                        }
                                        className="text-red-500"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </li>
                            ))
                          ) : (
                            <p className="text-gray-500">No expenses yet.</p>
                          )}
                        </ul>
                      )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default BudgetsPage;
