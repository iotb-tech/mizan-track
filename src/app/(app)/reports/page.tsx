"use client";

import { useData } from "@/lib/UserDataContext";
import { useHabits } from "@/hooks/useHabits";
import { useExpenses } from "@/hooks/useExpenses";
import { Select } from "@/component";
import { useMemo, useState } from "react";
import { BarChart, Chartdata } from "./charts";

export default function Page() {
  const { user_id } = useData();

  const [isLastWeek, setIsLastWeek] = useState("this_week");
  const [averageExpense, setAverageExpense] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);

  const { data: habits = [] } = useHabits(user_id);

  const {
    isLoading,
    error,
  } = useExpenses(user_id);

  const activeHabits = habits.length;

  const maxStreak = useMemo(
    () =>
      habits.length > 0
        ? Math.max(...habits.map((habit) => habit.streak), 0)
        : 0,
    [habits],
  );

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="p-12 text-center text-gray-500">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1976e8] border-r-transparent align-[-0.125em]" />
          <p className="mt-3 text-sm">Loading report...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-white p-12 text-center text-red-500 shadow-sm">
          <p className="text-sm">
            Failed to load your report. Please try again.
          </p>
        </div>
      ) : (
        <>
          {/* Statistics */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Spending</p>

              <h3 className="mt-2 text-2xl font-bold text-neutral-900">
                ₦{totalSpending.toLocaleString()}
              </h3>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Average Expense</p>

              <h3 className="mt-2 text-2xl font-bold text-neutral-900">
                ₦{averageExpense.toLocaleString()}
              </h3>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Active Habits</p>

              <h3 className="mt-2 text-2xl font-bold text-neutral-900">
                {activeHabits}
              </h3>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Best Streak</p>

              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                {maxStreak}
                <small className="text-sm font-normal text-gray-500">
                  {" "}
                  days
                </small>
              </h3>
            </div>
          </section>

          {/* Charts */}
          <section className="grid gap-4 xl:grid-cols-2">
            {/* Weekly spending */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900">
                  Spending Overview
                </h3>

                <Select
                  className="rounded-md border border-neutral-200 px-2 py-1 text-sm text-neutral-600 outline-none"
                  value={isLastWeek}
                  onChange={(e) => setIsLastWeek(e.target.value)}
                >
                  <option value="this_week">This week</option>
                  <option value="last_week">Last week</option>
                </Select>
              </div>

              <div className="mx-auto w-[90%]">
                <BarChart isLastWeek={isLastWeek} />
              </div>
            </div>

            {/* Category spending */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900">
                  Expenses by Category
                </h3>

                <p className="text-sm text-gray-500">This Month</p>
              </div>

              <div className="mx-auto w-[90%]">
                <Chartdata
                  setAverageExpense={setAverageExpense}
                  setTotal={setTotalSpending}
                />
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}