"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useData } from "@/lib/UserDataContext";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/lib/ThemeContext";
import { useExpenses } from "@/hooks/useExpenses";
import { useDeleteExpense } from "@/hooks/useDeleteExpense";
import { expenseKeys } from "@/lib/validation/queryKey";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userName, user_id } = useData();

  // ─── Theme ───
  const { darkMode, toggleTheme } = useTheme();

  // ─── Expenses Management ───
  const { data: expenses = [], isLoading: isExpensesLoading } = useExpenses(user_id);
  const deleteExpenseMutation = useDeleteExpense(user_id);
  const [expenseSearch, setExpenseSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expenseNotice, setExpenseNotice] = useState("");
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);

  const filteredExpenses = expenses.filter(
    (exp) =>
      exp.category.toLowerCase().includes(expenseSearch.toLowerCase()) ||
      (exp.note && exp.note.toLowerCase().includes(expenseSearch.toLowerCase()))
  );

  async function handleDeleteSingleExpense(id: string) {
    setDeletingId(id);
    try {
      await deleteExpenseMutation.mutateAsync(id);
      setExpenseNotice("Expense deleted successfully.");
      setTimeout(() => setExpenseNotice(""), 3000);
    } catch {
      setExpenseNotice("Failed to delete expense. Try again.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleClearAllExpenses() {
    setIsClearingAll(true);
    try {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("user_id", user_id);

      if (error) throw error;

      queryClient.invalidateQueries({
        queryKey: expenseKeys.list(user_id),
      });

      setShowClearAllModal(false);
      setExpenseNotice("All expense records have been cleared.");
      setTimeout(() => setExpenseNotice(""), 4000);
    } catch (err) {
      console.error("Error clearing all expenses:", err);
      setExpenseNotice("Failed to clear expenses. Please try again.");
    } finally {
      setIsClearingAll(false);
    }
  }

  // ─── Monthly Budget ───
  const BUDGET_KEY = `mizan_budget_${user_id}`;
  const [budgetInput, setBudgetInput] = useState("");
  const [budgetStatus, setBudgetStatus] = useState<"idle" | "saved">("idle");

  useEffect(() => {
    const saved = localStorage.getItem(BUDGET_KEY);
    if (saved) setBudgetInput(saved);
  }, [BUDGET_KEY]);

  function handleBudgetSave() {
    const num = Math.max(0, Number(budgetInput) || 0);
    localStorage.setItem(BUDGET_KEY, String(num));
    setBudgetInput(String(num));
    setBudgetStatus("saved");
    setTimeout(() => setBudgetStatus("idle"), 2000);
  }

  // ─── Profile update ───
  const [displayName, setDisplayName] = useState(userName);
  const [nameStatus, setNameStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  async function handleNameSave() {
    setNameStatus("saving");
    const { error } = await supabase.auth.updateUser({
      data: { name: displayName },
    });
    if (error) {
      setNameStatus("error");
      return;
    }
    setNameStatus("saved");
    setTimeout(() => setNameStatus("idle"), 2000);
  }

  // ─── Password change ───
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwStatus, setPwStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [pwError, setPwError] = useState("");

  async function handlePasswordChange() {
    setPwError("");

    if (newPassword.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Passwords don't match.");
      return;
    }

    setPwStatus("saving");
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPwError(error.message);
      setPwStatus("error");
      return;
    }

    setPwStatus("saved");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPwStatus("idle"), 2000);
  }

  // ─── Delete account ───
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ─── Logout ───
  async function handleLogout() {
    await supabase.auth.signOut();
    queryClient.clear();
    router.refresh();
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Manage your preferences, expenses, and account.
        </p>
      </div>

      {/* ─── Appearance ─── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Appearance
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Toggle between light and dark mode.
        </p>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{darkMode ? "🌙" : "☀️"}</span>
            <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
              {darkMode ? "Dark mode" : "Light mode"}
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={darkMode}
            onClick={toggleTheme}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              darkMode ? "bg-primary-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                darkMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </section>

      {/* ─── Manage & Delete Expenses ─── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Manage & Delete Expenses
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
              Review and delete your recorded spending transactions.
            </p>
          </div>

          {expenses.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearAllModal(true)}
              className="inline-flex items-center gap-1.5 self-start rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/70"
            >
              🗑️ Clear All Expenses
            </button>
          )}
        </div>

        {expenseNotice && (
          <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-medium text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-900 dark:text-emerald-300">
            {expenseNotice}
          </div>
        )}

        <div className="mt-5 space-y-4">
          {expenses.length > 3 && (
            <input
              type="text"
              value={expenseSearch}
              onChange={(e) => setExpenseSearch(e.target.value)}
              placeholder="Search expenses by category or note..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          )}

          {isExpensesLoading ? (
            <p className="text-center py-6 text-sm text-slate-400">
              Loading expense records...
            </p>
          ) : filteredExpenses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400 dark:border-gray-700">
              {expenses.length === 0
                ? "No expenses recorded yet."
                : "No matching expenses found."}
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-gray-800 dark:border-gray-700">
              {filteredExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-3.5 transition hover:bg-slate-50 dark:hover:bg-gray-800/50"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm dark:text-white truncate">
                        {exp.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(exp.date).toLocaleDateString()}
                      </span>
                    </div>
                    {exp.note && (
                      <p className="text-xs text-slate-500 dark:text-gray-400 truncate mt-0.5">
                        {exp.note}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      ₦{Number(exp.amount).toLocaleString()}
                    </span>

                    <button
                      type="button"
                      disabled={deletingId === exp.id}
                      onClick={() => handleDeleteSingleExpense(exp.id)}
                      title="Delete this expense"
                      className="rounded-lg border border-red-200 p-1.5 text-xs text-red-600 transition hover:bg-red-50 hover:border-red-300 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      {deletingId === exp.id ? (
                        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-500 border-r-transparent" />
                      ) : (
                        "🗑️"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Monthly Budget ─── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Monthly Budget
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Set your monthly spending limit to track on your dashboard.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="monthlyBudget"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
            >
              Budget Target (₦)
            </label>

            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-bold text-slate-500 dark:text-gray-400">
                ₦
              </span>
              <input
                id="monthlyBudget"
                type="number"
                min="0"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="e.g. 80000"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-8 pr-3.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBudgetSave}
              className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600 active:scale-[0.99]"
            >
              Save Budget
            </button>

            {budgetStatus === "saved" && (
              <span className="text-xs font-medium text-green-600">
                ✓ Budget saved
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ─── Profile ─── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Profile
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Update your display name.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="displayName"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
            >
              Display Name
            </label>

            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleNameSave}
              disabled={nameStatus === "saving" || displayName === userName}
              className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {nameStatus === "saving" ? "Saving..." : "Save Changes"}
            </button>

            {nameStatus === "saved" && (
              <span className="text-xs font-medium text-green-600">
                ✓ Saved
              </span>
            )}

            {nameStatus === "error" && (
              <span className="text-xs font-medium text-red-600">
                Failed to save. Try again.
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ─── Change Password ─── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Change Password
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Choose a strong password with at least 6 characters.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
            >
              New Password
            </label>

            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
            >
              Confirm New Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>

          {pwError && (
            <p className="text-xs font-medium text-red-600">{pwError}</p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePasswordChange}
              disabled={
                pwStatus === "saving" || !newPassword || !confirmPassword
              }
              className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pwStatus === "saving" ? "Updating..." : "Update Password"}
            </button>

            {pwStatus === "saved" && (
              <span className="text-xs font-medium text-green-600">
                ✓ Password updated
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ─── Danger Zone ─── */}
      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/50 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
          Danger Zone
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Irreversible and destructive actions.
        </p>

        <div className="mt-5 space-y-4">
          {/* Clear all expenses action in Danger Zone */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-gray-300">
                Clear all recorded expenses
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Permanently delete all your expense history.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowClearAllModal(true)}
              className="rounded-xl border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              Clear All Expenses
            </button>
          </div>

          <hr className="border-slate-100 dark:border-gray-800" />

          {/* Logout */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-gray-300">
                Sign out of your account
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                You can always sign back in.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Logout
            </button>
          </div>

          <hr className="border-slate-100 dark:border-gray-800" />

          {/* Delete account */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-gray-300">
                Delete your account
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Permanently remove your account and all data. This cannot be
                undone.
              </p>
            </div>

            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-xl border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                Delete Account
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-600 dark:text-red-400">
                  Are you sure?
                </span>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                >
                  Yes, Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Clear All Expenses Confirmation Modal */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600 dark:bg-red-950/60 dark:text-red-400">
              ⚠️
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Clear All Expenses?
              </h3>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Are you sure you want to permanently delete all your recorded expenses? This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowClearAllModal(false)}
                disabled={isClearingAll}
                className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleClearAllExpenses}
                disabled={isClearingAll}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50"
              >
                {isClearingAll ? "Clearing..." : "Yes, Clear All Expenses"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
