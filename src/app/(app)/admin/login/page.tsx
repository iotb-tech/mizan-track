"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter the master admin password.");
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
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please check your connection.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all dark:border-gray-700 dark:bg-gray-900 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-2xl text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            🛡️
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Administrator Login
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter the Master Admin Password to unlock portal access.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="master-password"
              className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300"
            >
              Master Admin Password
            </label>

            <div className="relative mt-1.5">
              <input
                id="master-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter master admin password..."
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
              <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
            <Link
              href="/dashboard"
              className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              ← Back to Dashboard
            </Link>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-[#0f4788] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1976e8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Login to Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
