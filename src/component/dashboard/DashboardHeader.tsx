"use client";

import { useData } from "@/lib/UserDataContext";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/component/ThemeToggle";
import Image from "next/image";
import Link from "next/link";

type DashboardHeaderProps = {
  onMenuClick: () => void;
};

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/habits": "Habits",
  "/expenses": "Expenses",
  "/reports": "Reports",
  "/profile": "Profile",
  "/settings": "Settings",
  "/admin": "Admin Portal",
  "/admin/settings": "Admin Security & Password",
};

export default function DashboardHeader({
  onMenuClick,
}: DashboardHeaderProps) {
  const { userName, isAdmin, avatarUrl } = useData();
  const pathname = usePathname();
  const currentTitle =
    routeTitles[pathname] ||
    (pathname.startsWith("/admin/users/") ? "User Record Audit" : "Dashboard");

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900 sm:px-6 lg:px-8">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 lg:hidden"
        >
          <span className="text-xl">☰</span>
        </button>

        <div>
          <h2 className="text-lg font-bold text-gray-900 transition-colors dark:text-white max-md:text-base">
            {currentTitle}
          </h2>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-gray-800 transition-colors dark:text-gray-200 max-md:text-xs">
            {userName}
          </span>
          {isAdmin && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
              Admin
            </span>
          )}
        </div>

        <ThemeToggle />

        <Link
          href="/profile"
          className="group relative transition hover:opacity-90"
          title="View & Edit Profile"
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={userName}
              width={40}
              height={40}
              unoptimized
              className="h-10 w-10 rounded-full border border-gray-200 object-cover shadow-sm transition group-hover:ring-2 group-hover:ring-[#1976e8] dark:border-gray-700"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-[#0f4788] transition group-hover:ring-2 group-hover:ring-[#1976e8] dark:bg-blue-900/50 dark:text-blue-200">
              {(userName || "U").charAt(0).toUpperCase()}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}