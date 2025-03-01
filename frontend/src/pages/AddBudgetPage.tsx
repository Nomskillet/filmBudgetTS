import BudgetForm from "../components/BudgetForm";

const AddBudgetPage = () => {
  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Add New Budget</h1>
      <BudgetForm />
    </div>
  );
};

export default AddBudgetPage;
