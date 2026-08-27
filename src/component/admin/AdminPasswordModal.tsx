"use client";

import { useState } from "react";

type AdminPasswordModalProps = {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
};

export function AdminPasswordModal({
  isOpen,
  onSuccess,
  onCancel,
}: AdminPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter the admin access password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed. Please try again.");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setPassword("");
      onSuccess();
    } catch {
      setError("Network error. Please check your connection.");
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all dark:border-gray-700 dark:bg-gray-900 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl text-[#0f4788] dark:bg-blue-900/50 dark:text-blue-200">
            🛡️
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Admin Verification
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Exclusive password required to access admin tools.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="admin-password-input"
              className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300"
            >
              Master Admin Password
            </label>

            <div className="relative mt-1.5">
              <input
                id="admin-password-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter admin password..."
                autoFocus
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#1976e8] focus:ring-2 focus:ring-[#1976e8]/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>

            {error && (
              <p
                className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-[#0f4788] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1976e8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify & Enter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
