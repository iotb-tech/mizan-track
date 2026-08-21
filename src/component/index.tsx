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
    <div className="">
      <label
        className="text-sm font-semibold  text-neutral-800"
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
      className="w-full border focus:border-primary-500 outline-0 px-3 py-2 mt-1 border-neutral-400 rounded-lg mb-2 "
      {...prop}
    />
  );
});

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant : 'primary' | 'secondary' | 'auth' | 'error'| 'muted';
}
export function Button({ variant, ...prop }:ButtonProps) {

  return (
    <button
      className={`${variant === "primary" ? "bg-primary-500 mt-3" : variant === "error" ? "bg-error/50 border-0 " : variant === 'auth'? "bg-primary-500 w-full" : variant=== "secondary" ? "bg-primary-300 border-0" :"bg-neutral-50 text-primary-600 border my-auto border-primary-500"} px-4 py-3 text-center mb-5 text-sm rounded-2xl text-neutral-50 cursor-pointer font-semibold disabled:cursor-not-allowed disabled:opacity-15`}
      {...prop}
    />
  );
}

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({children, ...prop},ref){
    return (
      <select ref={ref} {...prop}>{children}</select>
    )
  }
)


type LogoProp = {
  variant?: 'primary' | 'secondary' 
}

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
      width={300}
      height={100}
      className="object-contain"
    />
  );
}


export function Header(){
  return (
    <header>
      <div className="flex items-center justify-between px-10 py-1 bg-neutral-200">
        <Logo variant="secondary" />
        <NavBar />
        <Button variant="primary">
          <Link href='/register'>Get started</Link>
        </Button>
      </div>
    </header>
  )
}

export function Footer(){
  const year = new Date().getFullYear();

  return (
    <div className="bg-neutral-600 text-neutral-50 borber-t border-t-neutral-200">
      <p className=" mx-auto py-5 text-center ">&copy; Copyright {year}
      </p>
    </div>
  )
}


export function Card({icon, title, content}: {icon:string; title: string; content: string}){
  return (
    <div className="flex flex-col gap-3 justify-center bg-neutral-100 py-5 px-7 rounded-xl shadow-lg">
      <span className="h-10 w-10 grid place-items-center text-xl bg-primary-100 text-primary-500 rounded-lg shadow-xl" >{icon}</span>
      <h3 className="text-xl tracking-tight font-sans mb-3">{title}</h3>
      <p className="text-xs mb-5">{content}</p>

    </div>
  )
}


export { default as DashboardShell } from "./dashboard/DashboardShell";
export { default as DashboardHeader } from "./dashboard/DashboardHeader";
export { default as DashboardSidebar } from "./dashboard/DashboardSidebar";