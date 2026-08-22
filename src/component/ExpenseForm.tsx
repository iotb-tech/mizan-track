"use client";

import { Field, Input } from ".";
import { useForm } from "react-hook-form";
import {
  CreateExpenseInput,
  createExpenseSchema,
} from "@/lib/validation/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateExpense } from "@/hooks/useCreateExpense";
import { useData } from "@/lib/UserDataContext";

const expenseCategories = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Health",
  "Education",
  "Entertainment",
  "Other",
];

export function ExpenseForm({
  setIsOpen,
}: {
  setIsOpen: (val: boolean) => void;
}) {
  const { user_id } = useData();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<
    z.input<typeof createExpenseSchema>,
    unknown,
    CreateExpenseInput
  >({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      amount: undefined,
      category: "Food",
      date: new Date().toISOString().split("T")[0],
      note: "",
    },
  });

  const createExpense = useCreateExpense(user_id);

  async function onSubmit(value: CreateExpenseInput) {
    try {
      await createExpense.mutateAsync(value);
      reset();
      setIsOpen(false);
    } catch (error) {
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Could not save the expense",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-2 flex flex-col gap-4"
    >
      {errors.root && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {errors.root.message}
        </div>
      )}

      <Field
        label="Amount"
        htmlFor="expense-amount"
        error={errors.amount?.message}
      >
        <Input
          type="number"
          id="expense-amount"
          placeholder="e.g. 5000"
          min="0"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
          aria-invalid={Boolean(errors.amount)}
        />
      </Field>

      <Field
        label="Category"
        htmlFor="expense-category"
        error={errors.category?.message}
      >
        <select
          id="expense-category"
          {...register("category")}
          className="mt-1 w-full rounded-lg border border-neutral-400 bg-white p-2.5 text-gray-900 outline-0 focus:border-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {expenseCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Date"
        htmlFor="expense-date"
        error={errors.date?.message}
      >
        <Input
          type="date"
          id="expense-date"
          {...register("date")}
          aria-invalid={Boolean(errors.date)}
        />
      </Field>

      <Field
        label="Note"
        htmlFor="expense-note"
        error={errors.note?.message}
      >
        <textarea
          id="expense-note"
          placeholder="Optional note about this expense"
          rows={3}
          {...register("note")}
          aria-invalid={Boolean(errors.note)}
          className="mt-1 w-full rounded-lg border border-neutral-400 bg-white p-2.5 text-gray-900 outline-0 placeholder:text-gray-400 focus:border-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
        />
      </Field>

      <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 pt-2 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#1976e8] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#1267cf] disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add Expense"}
        </button>
      </div>
    </form>
  );
}