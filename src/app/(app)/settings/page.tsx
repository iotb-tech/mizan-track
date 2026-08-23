"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useData } from "@/lib/UserDataContext";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/lib/ThemeContext";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userName, user_id } = useData();

  // ─── Theme ───
  const { darkMode, toggleTheme } = useTheme();

  // ─── Monthly Budget ───
  const BUDGET_KEY = `mizan_budget_${user_id}`;
  const [budgetInput, setBudgetInput] = useState("");
  const [budgetStatus, setBudgetStatus] = useState<
    "idle" | "saved"
  >("idle");

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
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Manage your preferences and account.
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
    </div>
  );
}
