"use client";

import { useState } from "react";
import Link from "next/link";

const MASTER_ADMIN_DEFAULT_PASS = "Admin@MizanTrack2026!";

export default function AdminLoginPage() {
  const [password, setPassword] = useState(MASTER_ADMIN_DEFAULT_PASS);
  const [showPassword, setShowPassword] = useState(true);
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
      window.location.href = "/admin";
    } catch {
      setError("Network error. Please check your connection.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[65vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all dark:border-gray-700 dark:bg-gray-900 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Administrator Verification
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Master Admin access verification portal.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="master-password"
                className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300"
              >
                Master Admin Password
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-semibold text-[#1976e8] hover:underline"
              >
                {showPassword ? "Hide" : "Show Password"}
              </button>
            </div>

            <div className="relative">
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
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 pr-10 text-sm font-mono text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#1976e8] focus:ring-2 focus:ring-[#1976e8]/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>

            {error && (
              <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Master Admin Default Password Box */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-amber-700 dark:text-amber-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                </svg>
                Default Master Password:
              </span>
              <button
                type="button"
                onClick={() => {
                  setPassword(MASTER_ADMIN_DEFAULT_PASS);
                  setError("");
                }}
                className="font-semibold text-[#1976e8] hover:underline dark:text-blue-400"
              >
                Reset Default
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between rounded-lg bg-white px-3 py-2 font-mono text-xs font-bold text-gray-900 shadow-xs dark:bg-gray-800 dark:text-amber-200">
              <code>{MASTER_ADMIN_DEFAULT_PASS}</code>
              <span className="text-[10px] font-normal text-gray-400">Pre-filled</span>
            </div>
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
