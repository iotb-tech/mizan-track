"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AdminPasswordModal } from "@/component/admin/AdminPasswordModal";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [isChecking, setIsChecking] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  async function checkVerification() {
    try {
      const res = await fetch("/api/admin/verify");
      const data = await res.json();
      setIsVerified(Boolean(data.verified));
    } catch {
      setIsVerified(false);
    } finally {
      setIsChecking(false);
    }
  }

  useEffect(() => {
    checkVerification();
  }, []);

  async function handleExitAdminSession() {
    try {
      await fetch("/api/admin/verify", { method: "DELETE" });
    } catch {
      // ignore
    }
    setIsVerified(false);
    router.refresh();
    router.push("/dashboard");
  }

  function handleVerificationSuccess() {
    setIsVerified(true);
    router.refresh();
  }

  if (isChecking) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0f4788] border-r-transparent" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Checking admin permissions...
        </p>
      </div>
    );
  }

  return (
    <>
      <AdminPasswordModal
        isOpen={!isVerified}
        onSuccess={handleVerificationSuccess}
        onCancel={() => router.push("/dashboard")}
      />

      {isVerified && (
        <div className="space-y-6">
          {/* Admin Navigation Bar */}
          <div className="flex flex-col gap-4 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-lg text-white shadow-sm">
                🛡️
              </span>
              <div>
                <h1 className="text-base font-bold text-gray-900 dark:text-white">
                  Administrator Portal
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage accounts, elevate roles, and audit user activity in read-only mode.
                </p>
              </div>
            </div>

            {/* Admin Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin"
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  pathname === "/admin" || pathname.startsWith("/admin/users")
                    ? "bg-[#0f4788] text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                👥 User Directory
              </Link>

              <Link
                href="/admin/settings"
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  pathname === "/admin/settings"
                    ? "bg-[#0f4788] text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                🔐 Admin Password & Security
              </Link>

              <button
                type="button"
                onClick={handleExitAdminSession}
                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                title="Lock admin session and return to dashboard"
              >
                🚪 Exit Admin
              </button>
            </div>
          </div>

          {children}
        </div>
      )}
    </>
  );
}
