import { useState } from "react";
import { z } from "zod"; // ✅ Import Zod
import { useForm, useFieldArray } from "react-hook-form"; // ✅ Import React Hook Form and Field Array
import { zodResolver } from "@hookform/resolvers/zod"; // ✅ Import resolver
import { useNavigate } from "react-router-dom"; // ✅ Import navigation

// ✅ Define the validation schema using Zod for multiple budgets
const budgetSchema = z.object({
  budgets: z.array(
    z.object({
      title: z.string().min(3, "Title must be at least 3 characters"),
      budget: z
        .number({ invalid_type_error: "Budget must be a number" })
        .positive("Budget must be greater than 0"),
    })
  ),
});

type BudgetFormInputs = z.infer<typeof budgetSchema>; // ✅ Infer TypeScript types from Zod schema

function BudgetForm() {
  const navigate = useNavigate(); // ✅ React Router navigation

  const {
    register,
    handleSubmit,
    control,
    reset, // ✅ Reset form fields after successful submission
    formState: { errors },
  } = useForm<BudgetFormInputs>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      budgets: [{ title: "", budget: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "budgets",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: BudgetFormInputs) => {
    setErrorMessage("");
  
    try {
      const response = await fetch("http://localhost:5001/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budgets: data.budgets }), // ✅ Wrap data in { budgets: [...] }
      });
  
      if (!response.ok) {
        throw new Error("Failed to add budgets");
      }
  
      console.log("Budgets added successfully");
  
      reset(); // ✅ Clear input fields after successful submission
      navigate("/budgets"); // ✅ Redirect to the Budget Dashboard
    } catch (err) {
      setErrorMessage("Error adding budgets. Please try again.");
      console.error(err);
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Budgets</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div key={field.id} className="mb-4">
            <h3 className="text-xl font-semibold mb-2">
              Budget {index + 1}
            </h3>
            {/* Budget Title */}
            <label className="block mb-2">Budget Title</label>
            <input
              type="text"
              {...register(`budgets.${index}.title` as const)}
              className="w-full p-2 border rounded"
            />
            {errors.budgets?.[index]?.title && (
              <p className="text-red-500">
                {errors.budgets[index]?.title?.message as string}
              </p>
            )}

            {/* Budget Amount */}
            <label className="block mt-4 mb-2">Budget Amount</label>
            <input
              type="number"
              {...register(`budgets.${index}.budget` as const, {
                valueAsNumber: true,
              })}
              className="w-full p-2 border rounded"
            />
            {errors.budgets?.[index]?.budget && (
              <p className="text-red-500">
                {errors.budgets[index]?.budget?.message as string}
              </p>
            )}

            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 text-sm mt-2"
            >
              Remove Budget
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ title: "", budget: 0 })}
          className="text-blue-500 mb-2"
        >
          + Add Another Budget
        </button>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Save Budgets
        </button>
      </form>
    </div>
  );
}

export default BudgetForm;

