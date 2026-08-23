"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAuthInput, createAuthSchema } from "@/lib/validation/input";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateAuthInput>({
    resolver: zodResolver(createAuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: CreateAuthInput) => {
    const { email, password } = data;
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("root", { message: authError.message });
      return;
    }
    router.refresh();
    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full px-3 py-1 space-y-5"
    >
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
        >
          Email Address
        </label>

        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
          className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />

        {errors.email && (
          <p className="mt-1 text-xs text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="password"
            className="text-xs font-bold uppercase tracking-wider text-neutral-700"
          >
            Password
          </label>

          {/* Single, unified "Forgot password?" link */}
          <Link
            href="/forget-password"
            className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline transition"
          >
            Forgot password?
          </Link>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="text-xs font-bold uppercase tracking-wider text-neutral-700"
            >
              Password
            </label>

            <button
              type="button"
              onClick={() => {
                setIsForgotModalOpen(true);
                setForgotStatus("idle");
                setForgotMessage("");
              }}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline transition"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        {errors.password && (
          <p className="mt-1 text-xs text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p className="text-error" role="alert">
          {errors.root.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-xl bg-primary-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}