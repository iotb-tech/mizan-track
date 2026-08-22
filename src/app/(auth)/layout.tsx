"use client";

import { Logo } from "@/component";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRegister = pathname === "/register";

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-[#f5f8fc]">
      {/* Left Brand Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col justify-between bg-[linear-gradient(145deg,#0f4788,#1976e8)] p-12 lg:p-16 text-white">
        <div>
          <Link href="/" className="inline-block">
            <Logo variant="primary" />
          </Link>
        </div>

        <div className="max-w-lg">
          <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-100 backdrop-blur-sm">
            {isRegister ? "Start Your Journey" : "Welcome Back"}
          </span>

          <h1 className="mt-6 text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white">
            {isRegister
              ? "Start your consistency journey."
              : "Pick up right where you left off."}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-blue-100">
            {isRegister
              ? "Build better habits, track daily expenses, and gain clarity over your daily progress from one unified dashboard."
              : "Keep building your streaks and staying on top of your financial balance."}
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-blue-200">
          <span>✓ Habit Streaks</span>
          <span>✓ Expense Tracking</span>
          <span>✓ Visual Reports</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex min-h-screen items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/">
              <Logo variant="secondary" />
            </Link>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-8 sm:p-10 shadow-xl shadow-slate-900/5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}