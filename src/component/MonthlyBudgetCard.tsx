"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Expense } from "@/types/database";

function formatCurrency(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export function MonthlyBudgetCard({
  expenses,
  userId,
  className = "",
}: {
  expenses: Expense[];
  userId: string;
  className?: string;
}) {
  const STORAGE_KEY = `mizan_budget_${userId}`;

  // Monthly spending from real expense data
  const monthlySpent = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    return expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [expenses]);

  // This week's spending (deducted from the month)
  const thisWeekSpent = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay());

    return expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d >= startOfWeek && d <= now;
      })
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [expenses]);

  // Budget goal — persisted in localStorage per user
  const [budget, setBudget] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setBudget(Number(saved));
  }, [STORAGE_KEY]);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  function saveBudget() {
    const num = Math.max(0, Number(editValue) || 0);
    setBudget(num);
    localStorage.setItem(STORAGE_KEY, String(num));
    setIsEditing(false);
  }

  const pct =
    budget > 0 ? Math.min(100, Math.round((monthlySpent / budget) * 100)) : 0;

  const remaining = budget > 0 ? budget - monthlySpent : 0;

  const barColor =
    pct >= 90
      ? "bg-red-500"
      : pct >= 70
        ? "bg-yellow-500"
        : "bg-[#1976e8]";

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900 ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Monthly Budget
        </p>

        <button
          type="button"
          onClick={() => {
            setEditValue(String(budget || ""));
            setIsEditing(true);
          }}
          className="text-xs font-semibold text-[#1976e8] hover:text-[#1267cf] transition"
        >
          {budget > 0 ? "Edit" : "Set Budget"}
        </button>
      </div>

      {isEditing ? (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            ₦
          </span>
          <input
            ref={inputRef}
            type="number"
            min="0"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveBudget();
              if (e.key === "Escape") setIsEditing(false);
            }}
            placeholder="e.g. 80000"
            className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none transition focus:border-[#1976e8] focus:ring-1 focus:ring-[#1976e8]/30 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="button"
            onClick={saveBudget}
            className="rounded-lg bg-[#1976e8] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1267cf] transition"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div className="mt-2 flex items-baseline justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {budget > 0 ? formatCurrency(remaining) : formatCurrency(monthlySpent)}
              {budget > 0 && (
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                  {" "}remaining
                </span>
              )}
            </h3>
            {budget > 0 && (
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Budget: {formatCurrency(budget)}
              </span>
            )}
          </div>

          {budget > 0 ? (
            <>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{pct}% spent ({formatCurrency(monthlySpent)})</span>
                <span>
                  {remaining >= 0
                    ? `${formatCurrency(remaining)} left`
                    : `${formatCurrency(Math.abs(remaining))} over budget`}
                </span>
              </div>

              {thisWeekSpent > 0 && (
                <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                  −{formatCurrency(thisWeekSpent)} deducted this week
                </p>
              )}
            </>
          ) : (
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              Tap &quot;Set Budget&quot; to track monthly deductions.
            </p>
          )}

          {budget > 0 && pct >= 90 && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              ⚠ You&apos;ve used {pct}% of your monthly budget!
            </p>
          )}
        </>
      )}
    </div>
  );
}
