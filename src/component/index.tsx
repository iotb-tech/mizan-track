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
      className="w-full border focus:border-primary-500 outline-0 px-3 py-2 mt-3 border-neutral-400 rounded-lg mb-2 "
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
      className={`${variant === "primary" ? "bg-primary-500 mt-3" : variant === "error" ? "bg-error border-0 " : variant === 'auth'? "bg-primary-500 w-full" :"bg-neutral-50 text-primary-600 border my-auto border-primary-500"} px-3 py-2  text-center mb-5 text-lg rounded-2xl text-neutral-50 disabled:cursor-not-allowed disabled:opacity-15 font-bold`}
      {...prop}
    />
  );
}

type LogoProp = {
  variant?: 'primary' | 'secondary' 
}

export function LogoM(){
  return (
    <div
      className={
        "w-10 h-10 rounded-xl grid place-items-center text-neutral-50 font-extrabold text-xl shadow-[0px_6px_16px_#1d4ed8] bg-[linear-gradient(135deg,#93c5fd,#3b82f6)]"
      }
    >
      M
    </div>
  );
}
export function Logo({variant}: LogoProp) {
  return (
    <div className="flex items-center gap-3 font-extrabold text-xl">
      <LogoM />
      <div className={`${variant === "secondary" ? "text-neutral-900 tracking-wide" : "text-neutral-50"}`}>
        MIZAN TRACK{" "}
        <small
          className={` block text-[10px] ${variant === "secondary" ? "tracking-[0.1rem] text-neutral-400 " : "tracking-[0.5rem] font-semibold text-neutral-50"}  mt-0.5 `}
        >
          CONSISTENCY • EXPENSES • PROGRESS
        </small>
      </div>
    </div>
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