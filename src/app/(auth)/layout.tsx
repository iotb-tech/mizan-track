"use client";

import { Logo } from "@/component";
import { usePathname } from "next/navigation";

export default function LayOut({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isRegister = pathname === "/register";
  const isLogin = pathname === "/login";
  const isForgotPassword =
    pathname === "/forget-password" || pathname === "/reset-password";

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-950 md:grid md:grid-cols-2">

      {/* Branding Panel */}
      {(isRegister || isLogin || isForgotPassword) && (
        <div className="flex min-h-[420px] flex-col justify-center bg-[linear-gradient(145deg,#1d4ed8,#3b82f6)] px-4 py-10 sm:px-8 md:min-h-screen md:px-0">

          <div className="flex flex-col justify-center">

            {/* Logo */}
            <div className="flex justify-center px-4 sm:px-8 lg:px-12">
              <div className="w-full max-w-md rounded-3xl bg-[#f5f8fc] px-6 py-6 shadow-sm dark:bg-gray-900 sm:px-8 sm:py-7">
                <Logo variant={isRegister ? "primary" : undefined} />
              </div>
            </div>

            {/* Text */}
            <div className="px-6 pt-8 text-center sm:px-10 sm:pt-10 lg:px-16">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {isRegister
                  ? "Start your consistency journey."
                  : isForgotPassword
                    ? "Reset Your Password."
                    : "Welcome Back."}
              </h1>

              <p className="mx-auto mt-4 max-w-lg text-sm font-medium leading-6 text-blue-100 sm:mt-5 sm:text-base sm:leading-7">
                {isRegister
                  ? "Build better habits and take control of your spending from one place."
                  : isForgotPassword
                    ? "Create a new password and get back to your account."
                    : "Pick up where you left off and keep moving forward."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Panel */}
      <div className="flex min-h-[calc(100vh-420px)] w-full items-center justify-center bg-neutral-50 px-4 py-8 dark:bg-gray-950 sm:px-6 md:min-h-screen md:px-8">
        <div className="w-full max-w-md rounded-2xl bg-neutral-200 px-2 py-1 shadow-2xl dark:bg-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
}