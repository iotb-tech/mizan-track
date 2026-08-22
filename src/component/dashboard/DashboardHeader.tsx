"use client";

import { useData } from "@/lib/UserDataContext";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/component/ThemeToggle";

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
};

export default function DashboardHeader({
  onMenuClick,
}: DashboardHeaderProps) {
  const { userName } = useData();
  const pathname = usePathname();
  const currentTitle = routeTitles[pathname] || "Dashboard";

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
        <span className="text-sm font-semibold text-gray-800 transition-colors dark:text-gray-200 max-md:text-xs">
          {userName}
        </span>

        <ThemeToggle />

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-[#0f4788] dark:bg-blue-900/50 dark:text-blue-200">
          {(userName || "U").charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}