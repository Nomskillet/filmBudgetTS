import React from 'react';

interface AddExpenseModalProps {
  newExpense: {
    description: string;
    amount: string;
    owner: string;
    responsible: string;
    place_of_purchase: string;
    purchase_date: number | undefined;
    note: string;
  };
  setNewExpense: React.Dispatch<
    React.SetStateAction<{
      description: string;
      amount: string;
      owner: string;
      responsible: string;
      place_of_purchase: string;
      purchase_date: number | undefined;
      note: string;
    }>
  >;
  handleAddExpense: () => void;
  closeModal: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  newExpense,
  setNewExpense,
  handleAddExpense,
  closeModal,
}) => {
  return (
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
          type="text"
          placeholder="Owner"
          className="border p-2 w-full mb-2 rounded"
          value={newExpense.owner}
          onChange={(e) =>
            setNewExpense({ ...newExpense, owner: e.target.value })
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
        <input
          type="text"
          placeholder="Responsible"
          className="border p-2 w-full mb-2 rounded"
          value={newExpense.responsible}
          onChange={(e) =>
            setNewExpense({ ...newExpense, responsible: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Place of Purchase"
          className="border p-2 w-full mb-2 rounded"
          value={newExpense.place_of_purchase}
          onChange={(e) =>
            setNewExpense({
              ...newExpense,
              place_of_purchase: e.target.value,
            })
          }
        />
        <input
          type="date"
          className="border p-2 w-full mb-2 rounded"
          value={
            newExpense.purchase_date
              ? new Date(newExpense.purchase_date).toISOString().split('T')[0]
              : ''
          }
          onChange={(e) =>
            setNewExpense({
              ...newExpense,
              purchase_date: e.target.value
                ? new Date(e.target.value).getTime()
                : undefined,
            })
          }
        />
        <textarea
          placeholder="Note"
          className="border p-2 w-full mb-2 rounded"
          value={newExpense.note}
          onChange={(e) =>
            setNewExpense({ ...newExpense, note: e.target.value })
          }
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={closeModal}
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
  );
};

export default AddExpenseModal;
