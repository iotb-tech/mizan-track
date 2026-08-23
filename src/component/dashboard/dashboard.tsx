"use client";

import { ReactNode, useState } from "react";
import { useData } from "@/lib/UserDataContext";
import { useHabits } from "@/hooks/useHabits";
import { BarChart, Chartdata } from "@/app/(app)/reports/charts";
import { Select } from "..";
import Link from "next/link";
import { useExpenses } from "@/hooks/useExpenses";
import { ExpenseForm } from "../ExpenseForm";
import { ModalDialog } from "../ModalDialog";

export default function Dashboard({ children }: { children: ReactNode }) {
  const { user_id, userName } = useData();
  const { data: habits = [] } = useHabits(user_id);

  const { data: expenses = [], isLoading, error } = useExpenses(user_id);

  const [total, setTotal] = useState(0);
  const [islastWeek, setislastWeek] = useState("this_week");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const maxStreak =
    habits.length > 0 ? Math.max(...habits.map((h) => h.streak), 0) : 0;

  const completedToday = habits.filter((h) => h.doneToday).length;
  const totalHabits = habits.length;

  const habitProgressPct =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  return (
    <>
      <div className="space-y-6">
        {/* Dashboard heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 transition-colors dark:text-white sm:text-3xl">
              Welcome back, {userName.split(" ")[0] ?? ""}
            </h1>

            <p className="mt-1 text-sm text-gray-500 transition-colors dark:text-gray-400">
              Here&apos;s what&apos;s happening with your consistency and
              spending.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Current Streak */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Current Streak
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {maxStreak}{" "}
              <small className="text-sm font-normal text-gray-500 dark:text-gray-400">
                days
              </small>
            </h3>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Keep it up!
            </p>
          </div>

          {/* Habits Today */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Habits Today
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {completedToday}{" "}
              <small className="text-sm font-normal text-gray-500 dark:text-gray-400">
                / {totalHabits}
              </small>
            </h3>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-[#1976e8] transition-all duration-300"
                style={{ width: `${habitProgressPct}%` }}
              />
            </div>
          </div>

          {/* Weekly Spending */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This Week&apos;s Spending
            </p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              ₦{total}
            </h3>
          </div>

          {/* Monthly Budget */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monthly Budget
            </p>

            <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
              ₦8,700 / ₦80,000
            </h3>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <div className="h-full w-[12%] rounded-full bg-[#1976e8]" />
            </div>
          </div>
        </section>

        {/* Habit + Spending */}
        <section className="grid gap-6 xl:grid-cols-2">
          {/* Habit streaks */}
          {children}

          {/* Spending overview */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Spending Overview
              </h2>

              <Select
                className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-600 outline-none transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                onChange={(e) => setislastWeek(e.target.value)}
              >
                <option value="this_week">This Week</option>
                <option value="last_week">Last Week</option>
              </Select>
            </div>

            <BarChart isLastWeek={islastWeek} />

            {expenses.length === 0 ? (
              ""
            ) : (
              <div className="mt-5 rounded-lg bg-blue-50 px-4 py-3 text-sm text-gray-600 transition-colors dark:bg-blue-950/40 dark:text-gray-300">
                You spent <strong>₦{total}</strong> this week.
              </div>
            )}
          </div>
        </section>

        {/* Recent expenses */}
        <section className="grid gap-6 xl:grid-cols-2">
          {/* Recent Expenses */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Recent Expenses
              </h2>

              <Link
                href="/expenses"
                className="text-sm font-medium text-[#1976e8] hover:text-[#1267cf]"
              >
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1976e8] border-r-transparent align-[-0.125em]" />

                  <p className="mt-3 text-sm">Loading your expenses...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center text-red-500">
                  <p className="text-sm">
                    Failed to load expenses. Please try again.
                  </p>
                </div>
              ) : expenses.length === 0 ? (
                <div className="p-12 text-center">
                  <h3 className="mt-4 text-lg font-semibold text-gray-500 dark:text-gray-300">
                    No expenses recorded yet
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Start tracking your spending by adding your first expense.
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="mt-5 inline-flex items-center rounded-lg bg-[#1976e8] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#1267cf]"
                  >
                    + Add Your First Expense
                  </button>
                </div>
              ) : (
                <div>
                  {expenses.map((expense) => {
                    const dayAgo = Math.floor(
                      (new Date().getTime() -
                        new Date(expense.date).getTime()) /
                        86400000,
                    );

                    let date = "";

                    if (dayAgo === 0) {
                      date = "Today";
                    } else if (dayAgo === 1) {
                      date = "Yesterday";
                    } else {
                      date = new Date(expense.date).toLocaleDateString();
                    }

                    return (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between border-b border-gray-100 pb-4 transition-colors last:border-0 dark:border-gray-800"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {expense.category}
                          </p>

                          <p className="text-xs text-gray-400">
                            {expense.note}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            ₦{expense.amount}
                          </p>

                          <p className="text-xs text-gray-400">{date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Category Overview */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900">
            <Chartdata setTotal={setTotal} />
          </div>
        </section>

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
    </>
  );
}
