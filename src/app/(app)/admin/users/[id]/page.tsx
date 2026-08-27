"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { AdminUserDetail } from "@/types/database";

export default function AdminUserAuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: userId } = use(params);

  const [data, setData] = useState<AdminUserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"habits" | "expenses">("habits");

  useEffect(() => {
    async function fetchUserDetail() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(`/api/admin/users/${userId}`);
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Failed to load user records");
        }

        setData(result);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error fetching records");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserDetail();
  }, [userId]);

  function handleDownloadReport() {
    window.location.href = `/api/admin/users/${userId}/report`;
  }

  function handlePrint() {
    window.print();
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0f4788] border-r-transparent" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading user records for audit...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-12 text-center shadow-sm dark:border-red-900/40 dark:bg-gray-900">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
          {error || "User record not found."}
        </p>
        <Link
          href="/admin"
          className="mt-4 inline-flex items-center rounded-xl bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
        >
          ← Back to User Directory
        </Link>
      </div>
    );
  }

  const { profile, habits, expenses, metrics } = data;

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1976e8] hover:underline"
        >
          ← Back to User Directory
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            🖨️ Print / Save PDF
          </button>

          <button
            type="button"
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f4788] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1976e8] active:scale-[0.99]"
          >
            📥 Download CSV Report
          </button>
        </div>
      </div>

      {/* User Header & Read-Only Notice */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-bold text-[#0f4788] dark:bg-blue-900/50 dark:text-blue-200">
              {(profile.full_name || profile.email).charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {profile.full_name || "Unnamed User"}
                </h1>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    profile.role === "admin"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {profile.role.toUpperCase()}
                </span>
                {profile.is_disabled && (
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950/60 dark:text-red-300">
                    DISABLED
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                {profile.email} • Member since {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Read-Only Banner */}
        <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-2.5 text-xs font-medium text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200">
          <span>🔒</span>
          <span>
            <strong>Read-Only Audit Mode:</strong> You are auditing this user&apos;s activity. Altering or editing individual user records is disabled to protect user data integrity.
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Habits Count
          </p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.totalHabits}
          </h3>
          <p className="mt-1 text-xs text-gray-400">
            {metrics.completedToday} completed today
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Best Streak
          </p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.maxStreak}{" "}
            <small className="text-sm font-normal text-gray-500">days</small>
          </h3>
          <p className="mt-1 text-xs text-gray-400">Longest active consistency</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Spent (All-Time)
          </p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            ₦{metrics.totalSpent.toLocaleString("en-NG")}
          </h3>
          <p className="mt-1 text-xs text-gray-400">
            Across {metrics.expensesCount} transactions
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            This Month&apos;s Spend
          </p>
          <h3 className="mt-1 text-2xl font-bold text-[#1976e8]">
            ₦{metrics.monthlySpent.toLocaleString("en-NG")}
          </h3>
          <p className="mt-1 text-xs text-gray-400">Current calendar month</p>
        </div>
      </section>

      {/* Audit Tabs */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex border-b border-gray-200 px-6 dark:border-gray-800">
          <button
            type="button"
            onClick={() => setActiveTab("habits")}
            className={`border-b-2 py-4 px-4 text-sm font-semibold transition ${
              activeTab === "habits"
                ? "border-[#0f4788] text-[#0f4788] dark:border-blue-400 dark:text-blue-300"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            ✓ Habits Audit ({habits.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("expenses")}
            className={`border-b-2 py-4 px-4 text-sm font-semibold transition ${
              activeTab === "expenses"
                ? "border-[#0f4788] text-[#0f4788] dark:border-blue-400 dark:text-blue-300"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            ₦ Expenses Audit ({expenses.length})
          </button>
        </div>

        {/* Tab 1: Habits */}
        {activeTab === "habits" && (
          <div className="p-6">
            {habits.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                This user has not created any habits yet.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-colors dark:border-gray-700 dark:bg-gray-800/50"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {habit.name}
                      </h4>
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-[#0f4788] dark:bg-blue-900/60 dark:text-blue-200">
                        {habit.frequency_type}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Category: {habit.category || "General"}</span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        🔥 {habit.streak} day streak
                      </span>
                    </div>

                    {/* 7-Day History Pills (Read-only) */}
                    <div className="mt-3.5 border-t border-gray-200 pt-3 dark:border-gray-700">
                      <p className="text-[11px] font-medium text-gray-400">
                        Last 7 Days Progress:
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        {habit.recentHistory.map((done, idx) => (
                          <div
                            key={idx}
                            className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${
                              done
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-400 dark:bg-gray-700"
                            }`}
                            title={done ? "Completed" : "Not completed"}
                          >
                            {done ? "✓" : "•"}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Expenses */}
        {activeTab === "expenses" && (
          <div className="overflow-x-auto">
            {expenses.length === 0 ? (
              <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                This user has no recorded expense transactions.
              </p>
            ) : (
              <table className="w-full min-w-[550px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Amount</th>
                    <th className="px-6 py-3.5">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40">
                      <td className="px-6 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                        {expense.date}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-[#1976e8] dark:bg-blue-950/60 dark:text-blue-300">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-gray-900 dark:text-white">
                        ₦{Number(expense.amount).toLocaleString("en-NG")}
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-gray-400">
                        {expense.note || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
