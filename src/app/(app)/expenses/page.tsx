"use client";

import { useState } from "react";

import { useExpenses } from "@/hooks/useExpenses";
import { useData } from "@/lib/UserDataContext";
import { ModalDialog } from "@/component/ModalDialog";
import { ExpenseForm } from "@/component/ExpenseForm";

export default function ExpensesPage() {
  const { user_id } = useData();

  const {
    data: expenses = [],
    isLoading,
    error,
  } = useExpenses(user_id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Get unique categories from the existing expenses
  const categories = Array.from(
    new Set(expenses.map((expense) => expense.category).filter(Boolean))
  );

  // Filter expenses based on search and category
  const filteredExpenses = expenses.filter((expense) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      expense.category?.toLowerCase().includes(search) ||
      expense.note?.toLowerCase().includes(search) ||
      expense.date?.toLowerCase().includes(search);

    const matchesCategory =
      categoryFilter === "all" ||
      expense.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Your Expenses
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track where your money goes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-[#1976e8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1267cf]"
        >
          + Add Expense
        </button>
      </div>

      {/* Search & Filter */}
      {expenses.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search expenses..."
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1976e8] focus:ring-2 focus:ring-[#1976e8]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#1976e8] focus:ring-2 focus:ring-[#1976e8]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Expenses Content */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1976e8] border-r-transparent align-[-0.125em]" />

            <p className="mt-3 text-sm">
              Loading your expenses...
            </p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">
            <p className="text-sm">
              Failed to load expenses. Please try again.
            </p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-[#1976e8] dark:bg-blue-950/40">
              ₦
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              No expenses recorded yet
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Start tracking your spending by adding your first expense.
            </p>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-5 inline-flex items-center rounded-lg bg-[#1976e8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1267cf]"
            >
              + Add Your First Expense
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-700/40 dark:text-gray-400">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Note</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="transition hover:bg-gray-50/60 dark:hover:bg-gray-700/40"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {expense.date}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-[#1976e8] dark:bg-blue-950/40">
                          {expense.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        ₦{expense.amount.toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {expense.note || "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No expenses match your search or selected category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      <ModalDialog
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        dismiss={true}
      >
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Add a new expense
          </h2>

          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Record an expense to keep track of your spending.
          </p>

          <ExpenseForm setIsOpen={setIsModalOpen} />
        </div>
      </ModalDialog>
    </div>
  );
}