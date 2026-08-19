"use client";
import { ReactNode } from "react";
import { useData } from "@/lib/UserDataContext";
import { useHabits } from "@/hooks/useHabits";

export default function Dashboard({ children }: { children: ReactNode }) {
  const { user_id, userName } = useData();
  const { data: habits = [] } = useHabits(user_id);

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
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Welcome back{userName ? `, ${userName}` : ""} 👋
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Here&apos;s what&apos;s happening with your consistency and
              spending.
            </p>
          </div>

          <button
            type="button"
            className="w-full rounded-lg bg-[#1976e8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1267cf] sm:w-auto shadow-sm"
          >
            + Add Expense
          </button>
        </div>

        {/* Statistics */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Current Streak</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {maxStreak} <small className="text-sm font-normal text-gray-500">days</small>
            </h3>
            <p className="mt-1 text-xs text-gray-500">Keep it up!</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Habits Today</p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {completedToday} <small className="text-sm font-normal text-gray-500">/ {totalHabits}</small>
            </h3>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#1976e8] transition-all duration-300"
                style={{ width: `${habitProgressPct}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">This Week&apos;s Spending</p>

            <h3 className="mt-2 text-2xl font-bold text-gray-900">₦8,700</h3>

            <p className="mt-1 text-xs text-green-600">↓ 12% vs last week</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Monthly Budget</p>

            <h3 className="mt-2 text-xl font-bold text-gray-900">
              ₦8,700 / ₦80,000
            </h3>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-[12%] rounded-full bg-[#1976e8]" />
            </div>
          </div>
        </section>
        <section className="grid gap-6 xl:grid-cols-2">
          {/* Habit streaks */}
          {children}

          {/* Spending overview */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Spending Overview</h2>

              <select className="rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-600 outline-none">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>

            <div className="flex h-56 items-end justify-between gap-3 border-b border-gray-100 px-2 pb-2">
              {[40, 60, 30, 80, 45, 20, 5].map((height, index) => (
                <div
                  key={index}
                  className="flex h-full flex-1 items-end justify-center"
                >
                  <div
                    className="w-full max-w-10 rounded-t-md bg-[#1976e8]"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between text-xs text-gray-400">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            <div className="mt-5 rounded-lg bg-blue-50 px-4 py-3 text-sm text-gray-600">
              You spent <strong>₦8,700</strong> this week.
            </div>
          </div>
        </section>

        {/* Recent expenses */}
        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Expenses</h2>

              <button className="text-sm font-medium text-[#1976e8]">
                View all
              </button>
            </div>

            <div className="space-y-4">
              {[
                ["Lunch", "Food & Drinks", "₦2,500", "Today"],
                ["Transport", "Transportation", "₦1,200", "Yesterday"],
                ["React Course", "Education", "₦5,000", "May 25, 2025"],
              ].map(([name, category, amount, date]) => (
                <div
                  key={name}
                  className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {name}
                    </p>

                    <p className="text-xs text-gray-400">{category}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      {amount}
                    </p>

                    <p className="text-xs text-gray-400">{date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category overview */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                Expenses by Category
              </h2>

              <span className="text-sm text-gray-500">This Month</span>
            </div>

            <div className="flex min-h-52 items-center justify-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-full border-[24px] border-[#1976e8] border-r-blue-200 border-b-blue-300">
                <span className="text-lg font-bold text-gray-700">₦48k</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>● Food & Drinks — 38%</p>
              <p>● Transportation — 25%</p>
              <p>● Education — 17%</p>
              <p>● Shopping — 14%</p>
              <p>● Others — 6%</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}