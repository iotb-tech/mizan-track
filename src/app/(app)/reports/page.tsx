"use client";
import { useData } from "@/lib/UserDataContext";
import { useHabits } from "@/hooks/useHabits";
import { Select } from "@/component";

import { useMemo, useState } from "react";
import { BarChart, Chartdata } from "./charts";
import { useExpenses } from "@/hooks/useExpenses";



export default function Page(){
    const { user_id } = useData();
    const [islastWeek, setislastWeek] = useState('this_week')
    const [averageExpense, setaverageExpense] = useState<number | null>(0)
    const { data: habits =[] } = useHabits(user_id);
    const { isLoading } = useExpenses(user_id);
    const activeHabits = habits.length;
    const maxStreak = useMemo(() => (habits.length > 0 ? Math.max(...habits.map((item)=> item.streak),0) : 0),[habits]);

    return (
      <>
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1976e8] border-r-transparent align-[-0.125em]" />
            <p className="mt-3 text-sm">Loading...</p>
          </div>
        ) : (
          <div>
            {/* Statistics */}
            <section className="grid xl:grid-cols-4 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Total Spending</p>
                <h3 className="mt-1 text-xs text-gray-500"></h3>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">Average Expense</p>
                <h3 className="mt-2 text-2xl font-bold text-neutral-900">
                  ₦{isLoading ? "" : averageExpense?.toLocaleString()}
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
                <h3 className="mt-2 font-bold text-2xl text-gray-900">
                  {maxStreak}
                  <small className="text-sm font-normal text-gray-500">
                    {" "}
                    days
                  </small>
                </h3>
              </div>
            </section>
            {/* Charts */}
            <section className="grid gap-4 xl:grid-cols-2 mt-4">
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="font-semibold text-neutral-900">
                    Spending Overview
                  </h3>
                  <Select
                    className="rounded-md border border-neutral-200 px-2 py-1 text-sm text-neutral-600 outline-none"
                    value={islastWeek}
                    onChange={(e) => setislastWeek(e.target.value)}
                  >
                    <option value="this_week">This week</option>
                    <option value="last_week">Last week</option>
                  </Select>
                </div>
                <div className="w-[80%] mx-auto">
                  <BarChart islastWeek={islastWeek} />
                </div>
              </div>
              <div
                className="rounded-xl border border-neutral-200
                bg-white p-5 shadow-sm "
              >
                <div className="flex mb-5 items-center justify-between">
                  <h3 className="font-semibold text-neutral-900">
                    Expenses by Category
                  </h3>
                  <p className="text-gray-500 text-sm">This Month</p>
                </div>
                <div className="w-[80%] mx-auto">
                  <Chartdata setaverageExpense={setaverageExpense} />
                </div>
              </div>
            </section>
          </div>
        )}
      </>
    );
}