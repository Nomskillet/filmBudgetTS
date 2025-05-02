import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';
import api from '../utils/axios';
import type { Expense } from '../store/expenseSlice';
import type { Budget } from '../store/budgetSlice';
import {
  useGetBudgetsQuery,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
} from '../store/budgetApi';
import {
  useGetAllExpensesQuery,
  useAddExpenseMutation,
  useDeleteExpenseMutation,
  useUpdateExpenseMutation,
} from '../store/expenseApi';
import BudgetCard from '../components/BudgetCard';
import SearchResultCard from '../components/SearchResultCard';
import ExpensesModal from '../components/ExpensesModal';
import AddExpenseModal from '../components/AddExpenseModal';

function BudgetsPage() {
  const {
    data: budgets = [],
    isLoading: loading,
    error,
  } = useGetBudgetsQuery();

  const { data: allExpenses = [], refetch } = useGetAllExpensesQuery();

  const [deleteExpense] = useDeleteExpenseMutation();
  const [addExpense] = useAddExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();

  const [updateBudget] = useUpdateBudgetMutation();
  const [deleteBudget] = useDeleteBudgetMutation();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    title: '',
    budget: '0',
    spent: '0',
    owner: '',
    responsible: '',
    stage: '',
  });
  const [search, setSearch] = useState<string>('');

  const [activeBudget, setActiveBudget] = useState<number | null>(null);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState<number | null>(
    null
  );
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    owner: '',
    responsible: '',
    place_of_purchase: '',
    purchase_date: undefined as number | undefined,
    note: '',
    receipt_image_url: '',
  });

  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [editExpenseData, setEditExpenseData] = useState({
    description: '',
    amount: '',
    owner: '',
    responsible: '',
    place_of_purchase: '',
    purchase_date: undefined as number | undefined,
    note: '',
    receipt_image_url: '',
  });

  const [filteredExpenseGroups, setFilteredExpenseGroups] = useState<
    { budget: Budget; expenses: Expense[] }[]
  >([]);

  const [openedFromSearch, setOpenedFromSearch] = useState(false);

  const [viewExpensesModalBudget, setViewExpensesModalBudget] =
    useState<Budget | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredExpenseGroups([]);
      return;
    }

    const lowercaseSearch = search.toLowerCase();

    const groups = budgets
      .map((budget) => {
        const allExpensesForBudget = allExpenses.filter(
          (exp) => exp.budget_id === budget.id && !exp.deleted
        );

        const matchingExpenses = allExpensesForBudget.filter((expense) => {
          return [
            expense.description,
            expense.owner,
            expense.responsible,
            expense.place_of_purchase,
            expense.note,
          ]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(lowercaseSearch));
        });

        const budgetTitleMatch = budget.title
          .toLowerCase()
          .includes(lowercaseSearch);

        const budgetOwnerMatch = budget.owner
          ?.toLowerCase()
          .includes(lowercaseSearch);
        const budgetResponsibleMatch = budget.responsible
          ?.toLowerCase()
          .includes(lowercaseSearch);

        if (
          budgetTitleMatch ||
          budgetOwnerMatch ||
          budgetResponsibleMatch ||
          matchingExpenses.length > 0
        ) {
          return {
            budget,
            expenses: budgetTitleMatch
              ? allExpensesForBudget
              : matchingExpenses,
          };
        }

        return null;
      })
      .filter(Boolean) as { budget: Budget; expenses: Expense[] }[];

    setFilteredExpenseGroups(groups);
  }, [search, budgets, allExpenses]);

  const handleViewExpenses = (budgetId: number) => {
    const selected = budgets.find((b) => b.id === budgetId);
    if (selected) {
      setViewExpensesModalBudget(selected);
    }
  };

  const handleAddExpense = async () => {
    if (!showAddExpenseModal) return;

    try {
      const receiptImage = newExpense.receipt_image_url;

      await addExpense({
        budgetId: showAddExpenseModal,
        expenseData: {
          description: newExpense.description,
          amount: parseFloat(newExpense.amount),
          owner: newExpense.owner,
          responsible: newExpense.responsible,
          place_of_purchase: newExpense.place_of_purchase,
          purchase_date: newExpense.purchase_date
            ? new Date(newExpense.purchase_date).toISOString()
            : undefined,
          note: newExpense.note,
          receipt_image_url: receiptImage, // ✅ ensure this is set
        },
      }).unwrap();

      refetch();
      toast.success('Expense added successfully!');
      setNewExpense({
        description: '',
        amount: '',
        owner: '',
        responsible: '',
        place_of_purchase: '',
        purchase_date: undefined,
        note: '',
        receipt_image_url: '', // ✅ reset this
      });
      setShowAddExpenseModal(null);
    } catch (err) {
      console.error('Add expense error:', err);
      toast.error('Failed to add expense');
    }
  };

  const handleEditExpenseClick = (expense: Expense, budgetId: number) => {
    setEditingExpenseId(expense.id);
    setActiveBudget(budgetId);
    setEditExpenseData({
      description: expense.description,
      amount: expense.amount.toString(),
      owner: expense.owner || '',
      responsible: expense.responsible || '',
      place_of_purchase: expense.place_of_purchase || '',
      purchase_date: expense.purchase_date
        ? Number(expense.purchase_date)
        : undefined,
      note: expense.note || '',
      receipt_image_url: expense.receipt_image_url || '',
    });

    // Only open the modal if it's not already open
    if (!viewExpensesModalBudget || viewExpensesModalBudget.id !== budgetId) {
      const matchingBudget = budgets.find((b) => b.id === budgetId);
      if (matchingBudget) {
        setViewExpensesModalBudget(matchingBudget);
      }
    }
  };

  const handleUpdateExpense = async () => {
    if (!editingExpenseId || activeBudget === null) return;

    try {
      await updateExpense({
        expenseId: editingExpenseId,
        expenseData: {
          description: editExpenseData.description,
          amount: parseFloat(editExpenseData.amount),
          owner: editExpenseData.owner,
          responsible: editExpenseData.responsible,
          place_of_purchase: editExpenseData.place_of_purchase,
          purchase_date: editExpenseData.purchase_date
            ? new Date(editExpenseData.purchase_date).toISOString()
            : undefined,

          note: editExpenseData.note,
          receipt_image_url: editExpenseData.receipt_image_url,
        },
        budgetId: activeBudget,
      }).unwrap();

      toast.success('Expense updated successfully!');
      setEditingExpenseId(null);

      // ✅ Critical part for dynamic update
      refetch();

      // ✅ Modal cleanup
      if (openedFromSearch) {
        setViewExpensesModalBudget(null);
        setOpenedFromSearch(false);
      }
    } catch (error) {
      console.error('Failed to update expense:', error);
      toast.error('Failed to update expense');
    }
  };

  const handleDeleteExpense = async (expenseId: number, budgetId: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this expense?'
    );
    if (!confirmDelete) return;

    try {
      await deleteExpense({ budgetId, expenseId }).unwrap();
      toast.success('Expense deleted successfully!');
    } catch {
      toast.error('Failed to delete expense');
    }
  };

  const handleUploadAndOCR = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setOcrLoading(true);

      // Step 1: Upload the image
      const uploadResponse = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const filePath = uploadResponse.data.filePath;
      const filename = filePath.split('/').pop();

      setNewExpense((prev) => ({
        ...prev,
        receipt_image_url: filename || '',
      }));

      // Step 2: Run OCR
      const ocrResponse = await api.post('/upload/ocr', { filePath });

      const ocrText = ocrResponse.data.ocr_text;

      let extractedAmount = '';
      const rawLines = ocrText.split('\n');
      const normalizedLines = rawLines.map((line: string) =>
        line.trim().toLowerCase()
      );

      // Try to find best "total" line
      const totalLine =
        normalizedLines.find(
          (line: string) =>
            /(grand\s*total|total\s*amount|amount\s*due|amount\s*paid|total)/i.test(
              line
            ) &&
            !/subtotal|tax|items|number/i.test(line) &&
            /\d/.test(line)
        ) ||
        normalizedLines
          .filter((line: string) => /\d{1,5}(?:\.\d{2})/.test(line))
          .sort((a: string, b: string) => {
            const aMatch = a.match(/\d{1,5}(?:\.\d{2})/);
            const bMatch = b.match(/\d{1,5}(?:\.\d{2})/);
            return (
              (bMatch ? parseFloat(bMatch[0]) : 0) -
              (aMatch ? parseFloat(aMatch[0]) : 0)
            );
          })[0];

      if (totalLine) {
        const match = totalLine.match(/[-+]?\d{1,5}(?:\.\d{2})?/);
        if (match) {
          extractedAmount = match[0];
        }
      }

      // 🧠 Extract date in MM/DD/YYYY format
      const dateMatch = ocrText.match(
        /\b(\d{1,2})([/-])(\d{1,2})\2(\d{2,4})\b/
      );

      const extractedDate = dateMatch
        ? new Date(`${dateMatch[1]}/${dateMatch[3]}/${dateMatch[4]}`).getTime()
        : undefined;

      const storeInfo = rawLines
        .filter((line: string) => line.trim() !== '')
        .slice(0, 2)
        .join(', ');

      // ✅ Apply extracted info
      setNewExpense((prev) => ({
        ...prev,
        amount: extractedAmount || prev.amount,
        purchase_date: extractedDate || prev.purchase_date,
        place_of_purchase: storeInfo || prev.place_of_purchase,
        note:
          `${prev.note ? prev.note + '\n' : ''}Extracted Items:\n\n` +
          rawLines
            .filter((line: string) => /\d{1,5}(?:\.\d{2})/.test(line)) // lines with a price
            .map((line: string) => {
              const match = line.match(/(.+?)\s+(\d{1,5}(?:\.\d{2}))/);
              const label = match
                ? match[1].replace(/[^a-zA-Z0-9\s]/g, '').trim()
                : line;
              const price = match ? `$${match[2]}` : '';
              return `• ${label}${price ? ` – ${price}` : ''}`;
            })
            .join('\n'),
      }));

      toast.success('OCR completed and note updated!');
    } catch (err) {
      console.error('OCR failed:', err);
      toast.error('Failed to run OCR');
    } finally {
      setOcrLoading(false);
    }
  };

  const handleUpdate = (id: number) => {
    const requestBody = {
      title: editData.title,
      budget: parseFloat(editData.budget.replace(/^0+(?!$)/, '')) || 0,
      spent: parseFloat(editData.spent.replace(/^0+(?!$)/, '')) || 0,
      owner: editData.owner,
      responsible: editData.responsible,
      stage: editData.stage,
    };

    updateBudget({ id, updatedData: requestBody })
      .unwrap()
      .then(() => {
        toast.success('Budget updated successfully!');
        setEditingId(null);
      })
      .catch(() => toast.error('Failed to update budget'));
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this budget?'
    );

    if (!confirmDelete) return;

    deleteBudget(id)
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
    return (
      <p className="text-red-500">
        {typeof error === 'object' && 'status' in error
          ? `Error: ${error.status}`
          : 'An unexpected error occurred.'}
      </p>
    );
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
        <AddExpenseModal
          newExpense={newExpense}
          setNewExpense={setNewExpense}
          handleAddExpense={handleAddExpense}
          closeModal={() => setShowAddExpenseModal(null)}
          file={file}
          setFile={setFile}
          handleUploadAndOCR={handleUploadAndOCR}
          ocrLoading={ocrLoading}
        />
      )}

      <ul className="space-y-4">
        {search.trim() === ''
          ? budgets.map((budget) => {
              const expenses = allExpenses.filter(
                (exp) => exp.budget_id === budget.id && !exp.deleted
              );

              return (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  expenses={expenses}
                  editingId={editingId}
                  editData={editData}
                  onEditClick={(budget, dynamicSpent) => {
                    setEditingId(budget.id);
                    setEditData({
                      title: budget.title,
                      budget: budget.budget.toString(),
                      spent: dynamicSpent.toString(),
                      owner: budget.owner || '',
                      responsible: budget.responsible || '',
                      stage: budget.stage || '',
                    });
                  }}
                  onDeleteClick={handleDelete}
                  onSaveEdit={handleUpdate}
                  onCancelEdit={() => setEditingId(null)}
                  onViewExpenses={handleViewExpenses}
                  onAddExpenseClick={setShowAddExpenseModal}
                  onEditChange={(field, value) =>
                    setEditData((prev) => ({ ...prev, [field]: value }))
                  }
                />
              );
            })
          : filteredExpenseGroups.map(({ budget, expenses }) => (
              <SearchResultCard
                key={budget.id}
                budget={budget}
                expenses={expenses}
                onEditExpense={(expense, budgetId) => {
                  setOpenedFromSearch(true);
                  handleEditExpenseClick(expense, budgetId);
                }}
                onDeleteExpense={handleDeleteExpense}
              />
            ))}
      </ul>

      {viewExpensesModalBudget && (
        <ExpensesModal
          budget={viewExpensesModalBudget}
          allExpenses={allExpenses}
          editingExpenseId={editingExpenseId}
          editExpenseData={editExpenseData}
          setEditingExpenseId={setEditingExpenseId}
          setEditExpenseData={setEditExpenseData}
          handleUpdateExpense={handleUpdateExpense}
          handleEditExpenseClick={handleEditExpenseClick}
          handleDeleteExpense={handleDeleteExpense}
          closeModal={() => setViewExpensesModalBudget(null)}
        />
      )}
    </div>
  );
}

export default BudgetsPage;
