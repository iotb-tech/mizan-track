"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatus("error");
      setMessage("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setStatus("error");
      setMessage("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("New passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to update admin password.");
        setIsLoading(false);
        return;
      }

      setStatus("success");
      setMessage("✓ Master admin password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header & Back */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1976e8] hover:underline"
        >
          ← Back to User Directory
        </Link>
      </div>

      {/* Admin Password Card */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-2xl text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            🔐
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Change Master Admin Password
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Update the verification password required to unlock the Admin Portal.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="curr-admin-pw"
              className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300"
            >
              Current Admin Password
            </label>
            <input
              id="curr-admin-pw"
              type={showPasswords ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#1976e8] focus:ring-1 focus:ring-[#1976e8]/30 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="new-admin-pw"
              className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300"
            >
              New Admin Password (Min. 8 Characters)
            </label>
            <input
              id="new-admin-pw"
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#1976e8] focus:ring-1 focus:ring-[#1976e8]/30 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-admin-pw"
              className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300"
            >
              Confirm New Admin Password
            </label>
            <input
              id="confirm-admin-pw"
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#1976e8] focus:ring-1 focus:ring-[#1976e8]/30 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="show-pw-toggle"
              type="checkbox"
              checked={showPasswords}
              onChange={(e) => setShowPasswords(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#0f4788] focus:ring-[#1976e8]"
            />
            <label htmlFor="show-pw-toggle" className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
              Show passwords
            </label>
          </div>

          {status === "error" && (
            <div className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700 dark:bg-red-950/60 dark:text-red-300">
              {message}
            </div>
          )}

          {status === "success" && (
            <div className="rounded-xl bg-green-50 p-3 text-xs font-medium text-green-700 dark:bg-green-950/60 dark:text-green-300">
              {message}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#0f4788] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1976e8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Updating Password..." : "Update Master Admin Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
