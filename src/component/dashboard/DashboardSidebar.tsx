"use client";

import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useData } from "@/lib/UserDataContext";

type DashboardSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "⌂" },
  { name: "Habits", href: "/habits", icon: "✓" },
  { name: "Expenses", href: "/expenses", icon: "₦" },
  { name: "Reports", href: "/reports", icon: "▤" },
  { name: "Profile", href: "/profile", icon: "♙" },
  { name: "Settings", href: "/settings", icon: "⚙" },
];

export default function DashboardSidebar({
  isOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { isAdmin } = useData();

  async function logOut() {
    await supabase.auth.signOut();
    queryClient.clear();
    router.refresh();
    router.push("/login");
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-[#0f4788] text-white shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-white/10 bg-[#f5f8fc] px-6 dark:bg-[#111827]">
          <Image
            src="/images/mizan-logo-full.png"
            alt="Mizan Track"
            width={180}
            height={60}
            className="object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#1976e8] text-white shadow-sm"
                      : "text-blue-50 hover:bg-white/10"
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center text-sm">
                    {item.icon}
                  </span>

                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Admin Portal Entry (Only visible to verified Admins) */}
            {isAdmin && (
              <div className="pt-4 mt-4 border-t border-white/10">
                <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-blue-200/80 mb-2">
                  Administration
                </p>
                <Link
                  href="/admin"
                  onClick={onClose}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition ${
                    pathname.startsWith("/admin")
                      ? "bg-amber-500 text-white shadow-sm font-semibold"
                      : "text-amber-300 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                      </svg>
                    </span>
                    <span>Admin Portal</span>
                  </div>
                  <span className="rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-200 uppercase">
                    Admin
                  </span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={logOut}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-warning transition hover:bg-white/10"
          >
            <span>↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}