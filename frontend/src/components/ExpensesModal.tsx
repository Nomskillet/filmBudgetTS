import React from 'react';
import type { Budget } from '../store/budgetSlice';
import type { Expense } from '../store/expenseSlice';

interface ExpensesModalProps {
  budget: Budget;
  allExpenses: Expense[];
  editingExpenseId: number | null;
  editExpenseData: {
    description: string;
    amount: string;
    owner: string;
    responsible: string;
    place_of_purchase: string;
    purchase_date: number | undefined;
    note: string;
    receipt_image_url: string;
  };
  setEditExpenseData: React.Dispatch<
    React.SetStateAction<{
      description: string;
      amount: string;
      owner: string;
      responsible: string;
      place_of_purchase: string;
      purchase_date: number | undefined;
      note: string;
      receipt_image_url: string;
    }>
  >;
  setEditingExpenseId: React.Dispatch<React.SetStateAction<number | null>>;
  handleEditExpenseClick: (expense: Expense, budgetId: number) => void;
  handleDeleteExpense: (expenseId: number, budgetId: number) => void;
  handleUpdateExpense: () => void;
  closeModal: () => void;
}

const ExpensesModal: React.FC<ExpensesModalProps> = ({
  budget,
  allExpenses,
  editingExpenseId,
  editExpenseData,
  setEditExpenseData,
  setEditingExpenseId,
  handleEditExpenseClick,
  handleDeleteExpense,
  handleUpdateExpense,
  closeModal,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-h-[80vh] w-[90%] max-w-2xl flex flex-col overflow-hidden">
        {/* Header with sticky title + close */}
        <div className="sticky top-0 z-10 flex justify-between items-center px-6 py-4 bg-white border-b">
          <h2 className="text-2xl font-bold">
            Expenses for:{' '}
            <span className="text-purple-700">{budget.title}</span>
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-700 text-2xl font-bold hover:text-red-500 focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Scrollable content */}
        <div className="p-6 overflow-y-auto">
          <ul className="space-y-4">
            {allExpenses
              .filter((e) => e.budget_id === budget.id && !e.deleted)
              .map((expense) => (
                <li key={expense.id} className="border rounded p-4 bg-gray-50">
                  {editingExpenseId === expense.id ? (
                    <div className="flex flex-col gap-2">
                      {[
                        'description',
                        'amount',
                        'owner',
                        'responsible',
                        'place_of_purchase',
                        'note',
                      ].map((field) => (
                        <label key={field}>
                          <span className="block text-sm text-gray-600">
                            {field.replace('_', ' ')}
                          </span>
                          <input
                            type={field === 'amount' ? 'number' : 'text'}
                            value={
                              editExpenseData[
                                field as keyof typeof editExpenseData
                              ]
                            }
                            onChange={(e) =>
                              setEditExpenseData((prev) => ({
                                ...prev,
                                [field as keyof typeof editExpenseData]:
                                  e.target.value,
                              }))
                            }
                            className="border p-2 rounded w-full"
                          />
                        </label>
                      ))}

                      <label>
                        <span className="block text-sm text-gray-600">
                          Purchase Date
                        </span>
                        <input
                          type="date"
                          value={
                            editExpenseData.purchase_date
                              ? new Date(editExpenseData.purchase_date)
                                  .toISOString()
                                  .split('T')[0]
                              : ''
                          }
                          onChange={(e) =>
                            setEditExpenseData((prev) => ({
                              ...prev,
                              purchase_date: e.target.value
                                ? new Date(e.target.value).getTime()
                                : undefined,
                            }))
                          }
                          className="border p-2 rounded w-full"
                        />
                      </label>

                      <label>
                        <span className="block text-sm text-gray-600">
                          Replace Receipt Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const formData = new FormData();
                            formData.append('image', file);

                            fetch('http://localhost:5001/api/upload', {
                              method: 'POST',
                              body: formData,
                            })
                              .then((res) => res.json())
                              .then((data) => {
                                const filePath = data.filePath;
                                const filename = filePath.split('/').pop();
                                if (!filename) return;

                                setEditExpenseData((prev) => ({
                                  ...prev,
                                  receipt_image_url: filename,
                                }));

                                return fetch(
                                  'http://localhost:5001/api/upload/ocr',
                                  {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ filePath }),
                                  }
                                );
                              })
                              .then((res) => res?.json())
                              .then((ocr) => {
                                if (!ocr) return;
                                const ocrText = ocr.ocr_text;
                                const rawLines = ocrText.split('\n');
                                const normalizedLines = rawLines.map(
                                  (line: string) => line.trim().toLowerCase()
                                );

                                let amount = '';
                                const totalLine =
                                  normalizedLines.find(
                                    (line: string) =>
                                      /(total|amount\s*due|amount\s*paid)/.test(
                                        line
                                      ) &&
                                      !/(subtotal|tax|number|items)/.test(line)
                                  ) ||
                                  normalizedLines
                                    .filter((line: string) =>
                                      /\d{1,5}(?:\.\d{2})/.test(line)
                                    )
                                    .sort((a: string, b: string) => {
                                      const aMatch =
                                        a.match(/\d{1,5}(?:\.\d{2})/);
                                      const bMatch =
                                        b.match(/\d{1,5}(?:\.\d{2})/);
                                      return (
                                        (bMatch ? parseFloat(bMatch[0]) : 0) -
                                        (aMatch ? parseFloat(aMatch[0]) : 0)
                                      );
                                    })[0];

                                if (totalLine) {
                                  const match = totalLine.match(
                                    /[-+]?\d{1,5}(?:\.\d{2})?/
                                  );
                                  if (match) amount = match[0];
                                }

                                const dateMatch = ocrText.match(
                                  /\b(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\b/
                                );
                                const purchaseDate = dateMatch
                                  ? new Date(
                                      `${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}`
                                    ).getTime()
                                  : undefined;

                                const storeInfo = rawLines
                                  .filter((line: string) => line.trim() !== '')
                                  .slice(0, 2)
                                  .join(', ');

                                setEditExpenseData((prev) => ({
                                  ...prev,
                                  amount: amount || prev.amount,
                                  purchase_date:
                                    purchaseDate || prev.purchase_date,
                                  place_of_purchase:
                                    storeInfo || prev.place_of_purchase,
                                  note: ocrText,
                                }));
                              })
                              .catch((err) => {
                                console.error('Upload or OCR failed', err);
                                alert(
                                  'Failed to upload or process receipt image.'
                                );
                              });
                          }}
                          className="text-sm mt-1"
                        />
                      </label>

                      {editExpenseData.receipt_image_url && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 italic mb-1">
                            Current Receipt Preview:
                          </p>
                          <img
                            src={`http://localhost:5001/uploads/${editExpenseData.receipt_image_url}`}
                            alt="Uploaded Receipt"
                            className="w-full max-w-xs border rounded"
                          />
                        </div>
                      )}

                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={handleUpdateExpense}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingExpenseId(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-lg">
                          {expense.description}: $
                          {Number(expense.amount).toFixed(2)}
                        </p>
                        {expense.owner && (
                          <p className="text-sm text-gray-700">
                            Owner: {expense.owner}
                          </p>
                        )}
                        {expense.responsible && (
                          <p className="text-sm text-gray-700">
                            Responsible: {expense.responsible}
                          </p>
                        )}
                        {expense.place_of_purchase && (
                          <p className="text-sm text-gray-700">
                            Place: {expense.place_of_purchase}
                          </p>
                        )}
                        <p className="text-sm text-gray-700">
                          Date:{' '}
                          {expense.purchase_date &&
                          !isNaN(new Date(expense.purchase_date).getTime())
                            ? new Date(
                                expense.purchase_date
                              ).toLocaleDateString()
                            : '—'}
                        </p>

                        {expense.note && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 italic mb-1">
                              Note:
                            </p>
                            <ul className="list-disc pl-5 whitespace-pre-wrap text-sm text-gray-700">
                              {expense.note
                                .split('\n')
                                .filter((line) => line.trim() !== '')
                                .map((line, index) => (
                                  <li key={index}>{line.trim()}</li>
                                ))}
                            </ul>
                          </div>
                        )}

                        {expense.receipt_image_url && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 italic mb-1">
                              Receipt Image:
                            </p>
                            <p className="text-xs text-gray-500">
                              Filename: {expense.receipt_image_url}
                            </p>
                            <img
                              src={`http://localhost:5001/uploads/${expense.receipt_image_url}`}
                              alt="Receipt"
                              className="w-full max-w-xs border rounded"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() =>
                            handleEditExpenseClick(expense, budget.id)
                          }
                          className="text-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteExpense(expense.id, budget.id)
                          }
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExpensesModal;
