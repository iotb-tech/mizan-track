"use client";

import { useTheme } from "@/lib/ThemeContext";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-base transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      aria-label="Toggle dark mode"
    >
      {darkMode ? "🌙" : "☀️"}
    </button>
  );
}
