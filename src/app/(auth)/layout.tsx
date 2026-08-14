"use client";
import { Logo } from "@/component";
import { usePathname } from "next/navigation";


export default function LayOut({ children }:{ children: React.ReactNode }){
  const pathname = usePathname()
    return (
      <div className="min-h-screen justify-center items-center grid md:grid-cols-2 max-md:grid-cols-1">
        {pathname === "/register" ? (
          <div
            className={
              "flex flex-col justify-center max-md:hidden bg-[linear-gradient(145deg,#1d4ed8,#3b82f6)] min-h-screen"
            }
          >
            <div className="p-8 lg:p-16">
              <Logo />
              <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight my-10 text-neutral-50">
                Start your consistency journey.
              </h1>
              <p className="text-neutral-50 text-base leading-[1.7]">
                Build better habits and take control of your spending from one
                place.
              </p>
            </div>
          </div>
        ) : pathname === "/login" ? (
          <div
            className={
              "flex flex-col justify-center max-md:hidden bg-[linear-gradient(145deg,#1d4ed8,#3b82f6)] min-h-screen"
            }
          >
            <div className="p-8 lg:p:16">
              <Logo />
              <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight my-10 text-neutral-50">
                Welcome Back.
              </h1>
              <p className="text-neutral-50 text-base leading-[1.7]" >Pick up where you left off and keep moving forward.</p>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="flex justify-center items-center">
          <div className="bg-neutral-200 shadow-2xl px-2 py-1 rounded-2xl">
            {children}
          </div>
        </div>
      </div>
    );
}