import Image from "next/image";
import Link from "next/link";
import { forwardRef, type ReactNode } from "react";
import { NavBar } from "./nav-bar";

export function Field({
  label,
  htmlFor,
  children,
  error,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        className="text-sm font-semibold text-neutral-800 dark:text-neutral-200"
        htmlFor={htmlFor}
      >
        {label}
      </label>

      {children}

      {error && (
        <p className="text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ ...prop }, ref) {
  return (
    <input
      ref={ref}
      className="mt-1 mb-2 w-full rounded-lg border border-neutral-400 bg-white px-3 py-2 text-neutral-900 outline-0 focus:border-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
      {...prop}
    />
  );
});

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: "primary" | "secondary" | "auth" | "error" | "muted";
};

export function Button({ variant, ...prop }: ButtonProps) {
  return (
    <button
      className={`${
        variant === "primary"
          ? "mt-3 bg-primary-500"
          : variant === "error"
            ? "border-0 bg-error"
            : variant === "auth"
              ? "w-full bg-primary-500"
              : "my-auto border border-primary-500 bg-neutral-50 text-primary-600 dark:bg-neutral-800 dark:text-primary-400"
      } mb-5 rounded-2xl px-3 py-1 text-center text-lg font-semibold text-neutral-50 disabled:cursor-not-allowed disabled:opacity-15`}
      {...prop}
    />
  );
}

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ children, ...prop }, ref) {
  return (
    <select ref={ref} {...prop}>
      {children}
    </select>
  );
});

type LogoProp = {
  variant?: "primary" | "secondary";
};

export function LogoM() {
  return (
    <Image
      src="/images/mizan-icon.png"
      alt="Mizan Track"
      width={40}
      height={40}
      className="object-contain"
    />
  );
}

export function Logo({ variant }: LogoProp) {
  return (
    <Image
      src="/images/mizan-logo-full.png"
      alt="Mizan Track"
      width={500}
      height={167}
      className="h-auto w-full object-contain"
    />
  );
}

export function Header() {
  return (
    <header>
      <div className="flex items-center justify-between bg-neutral-200 px-10 py-1 dark:bg-neutral-900">
        <Logo variant="secondary" />
        <NavBar />

        <Button variant="primary">
          <Link href="/register">Get started</Link>
        </Button>
      </div>
    </header>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <div className="border-t border-neutral-200 bg-neutral-600 text-neutral-50 dark:border-neutral-700 dark:bg-neutral-950">
      <p className="mx-auto py-5 text-center">
        &copy; Copyright {year}
      </p>
    </div>
  );
}

export function Card({
  icon,
  title,
  content,
}: {
  icon: string;
  title: string;
  content: string;
}) {
  return (
    <div className="flex flex-col justify-center gap-3 rounded-xl bg-neutral-100 px-7 py-5 shadow-lg dark:bg-neutral-800">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-100 text-xl text-primary-500 shadow-xl dark:bg-primary-500/10 dark:text-primary-400">
        {icon}
      </span>

      <h3 className="mb-3 font-sans text-xl tracking-tight text-neutral-900 dark:text-white">
        {title}
      </h3>

      <p className="mb-5 text-xs text-neutral-600 dark:text-neutral-300">
        {content}
      </p>
    </div>
  );
}

export { default as DashboardShell } from "./dashboard/DashboardShell";
export { default as DashboardHeader } from "./dashboard/DashboardHeader";
export { default as DashboardSidebar } from "./dashboard/DashboardSidebar";