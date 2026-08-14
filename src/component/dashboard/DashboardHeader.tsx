"use client";

type DashboardHeaderProps = {
  onMenuClick: () => void;
};

export default function DashboardHeader({
  onMenuClick,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-100 lg:hidden"
        >
          <span className="text-xl">☰</span>
        </button>

        <div>
          <p className="text-xs font-medium text-gray-500">
            Dashboard
          </p>

          <h2 className="text-lg font-semibold text-gray-900">
            Mizan Track
          </h2>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="hidden rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:block"
        >
          Notifications
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-[#0f4788]">
          A
        </div>
      </div>
    </header>
  );
}