import { useState } from "react";
import { z } from "zod"; // ✅ Import Zod
import { useForm } from "react-hook-form"; // ✅ Import React Hook Form
import { zodResolver } from "@hookform/resolvers/zod"; // ✅ Import resolver
import { useNavigate } from "react-router-dom"; // ✅ Import navigation

// ✅ Define the validation schema using Zod
const budgetSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  budget: z
    .number({ invalid_type_error: "Budget must be a number" })
    .positive("Budget must be greater than 0"),
});

type BudgetFormInputs = z.infer<typeof budgetSchema>; // ✅ Infer TypeScript types from Zod schema

function BudgetForm() {
  const navigate = useNavigate(); // ✅ React Router navigation

  const {
    register,
    handleSubmit,
    reset, // ✅ Reset form fields after successful submission
    formState: { errors },
  } = useForm<BudgetFormInputs>({
    resolver: zodResolver(budgetSchema),
  });

  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Handle form submission
  const onSubmit = async (data: BudgetFormInputs) => {
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5001/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add budget");
      }

      console.log("Budget added successfully");

      reset(); // ✅ Clear input fields after successful submission
      navigate("/budgets"); // ✅ Redirect to the Budget Dashboard
    } catch (err) {
      setErrorMessage("Error adding budget. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Budget</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Budget Title */}
        <label className="block mb-2">Budget Title</label>
        <input
          type="text"
          {...register("title")}
          className="w-full p-2 border rounded"
        />
        {errors.title && (
          <p className="text-red-500">{errors.title.message as string}</p>
        )}

        {/* Budget Amount */}
        <label className="block mt-4 mb-2">Budget Amount</label>
        <input
          type="number"
          {...register("budget", { valueAsNumber: true })}
          className="w-full p-2 border rounded"
        />
        {errors.budget && (
          <p className="text-red-500">{errors.budget.message as string}</p>
        )}

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Add Budget
        </button>
      </form>
    </div>
  );
}

export default BudgetForm;
