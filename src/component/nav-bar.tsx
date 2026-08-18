"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoM } from ".";

type Linkprop = {
  name: string;
  href: string;
  id: string;
};

export const links: Linkprop[] = [
  { name: "Home", href: "/welcome", id: "home" },
  { name: "Login", href: "/login", id: "login" },
  { name: "Register", href: "/register", id: "register" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <LogoM />
          <span className="text-xl font-bold text-neutral-900">
            Mizan Track
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary-500 ${
                  pathname === link.href
                    ? "text-primary-500"
                    : "text-neutral-700"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Authentication Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:text-primary-500 sm:block"
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
      </div>
    </nav>
  );
}