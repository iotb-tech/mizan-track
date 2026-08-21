"use client";

import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

type DashboardSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function DashboardSidebar({
  isOpen,
  onClose,
}: DashboardSidebarProps) {

  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const queryClient = useQueryClient();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "⌂",
    },
    {
      name: "Habits",
      href: `/habits`,
      icon: "✓",
    },
    {
      name: "Expenses",
      href: "/expenses",
      icon: "₦",
    },
    {
      name: "Reports",
      href: "/reports",
      icon: "▤",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: "♙",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: "⚙",
    },
  ];

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

       <div className="flex h-20 items-center border-b border-white/10 px-6">
     <Image
    src="/images/mizan-logo-full.png"
    alt="Mizan Track"
    width={180}
    height={60}
    className="object-contain"
  />
    </div>

        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#0f4788]">
            M
          </div>

          <div>
            <h1 className="text-base font-bold tracking-wide">MIZAN TRACK</h1>

            <p className="text-[9px] uppercase tracking-[0.18em] text-blue-100">
              Consistency • Expenses • Progress
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
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
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={logOut}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium  text-warning transition hover:bg-white/10"
          >
            <span>↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
