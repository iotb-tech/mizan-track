"use client";

import { useEffect } from "react";

export default function ClearCookiesPage() {
  useEffect(() => {
    // Clear all cookies in browser
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    // Clear localStorage & sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login after 1 second
    setTimeout(() => {
      window.location.href = "/login";
    }, 800);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl text-center dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-4">
          🧹
        </div>
        <h1 className="text-xl font-bold">Clearing Stale Cookie Headers...</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
          Resetting oversized auth cookies to prevent HTTP 431 errors. Redirecting to login...
        </p>
      </div>
    </div>
  );
}
