"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoM } from ".";

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <LogoM />
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-neutral-900 group-hover:text-primary-600 transition">
              MIZAN TRACK
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-400">
              Consistency • Expenses • Progress
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className={`text-sm font-semibold transition ${
              pathname === "/"
                ? "text-primary-600"
                : "text-neutral-600 hover:text-primary-600"
            }`}
          >
            Home
          </Link>
          <a
            href="#features"
            className="text-sm font-semibold text-neutral-600 transition hover:text-primary-600"
          >
            Features
          </a>
          <a
            href="#overview"
            className="text-sm font-semibold text-neutral-600 transition hover:text-primary-600"
          >
            Overview
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:text-primary-600 hover:bg-neutral-50"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}