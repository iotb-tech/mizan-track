"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

type Linkprop = {
  name: string;
  href: string;
  id: string;
};

export const links: Linkprop[] = [
  { name: "Home", href: "/", id: "home" },
  { name: "Features", href: "/#features", id: "features" },
  { name: "Overview", href: "/#overview", id: "overview" },
];

export function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full border-b border-neutral-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/mizan-logo-full.png"
            alt="Mizan Track"
            width={180}
            height={60}
            className="object-contain h-auto w-35 sm:w-45"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary-500 ${
                  pathname === link.href
                    ? "text-primary-500"
                    : "text-neutral-700 dark:text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Authentication Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:text-primary-500 dark:text-gray-300"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 transition hover:bg-neutral-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="border-t border-neutral-200 bg-white px-6 pb-6 pt-4 dark:border-gray-800 dark:bg-gray-950 md:hidden">
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block text-sm font-medium transition-colors hover:text-primary-500 ${
                    pathname === link.href
                      ? "text-primary-500"
                      : "text-neutral-700 dark:text-gray-300"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg border border-neutral-300 px-4 py-2.5 text-center text-sm font-semibold text-neutral-700 transition hover:border-primary-500 hover:text-primary-500 dark:border-gray-600 dark:text-gray-300"
            >
              Login
            </Link>

            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg bg-primary-500 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
