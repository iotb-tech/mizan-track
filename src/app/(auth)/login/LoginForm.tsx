"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAuthInput, createAuthSchema } from "@/lib/validation/input";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [forgotMessage, setForgotMessage] = useState("");

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotMessage("Please enter your email address.");
      setForgotStatus("error");
      return;
    }

    setForgotStatus("loading");
    setForgotMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        forgotEmail,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        },
      );

      if (error) {
        setForgotStatus("error");
        setForgotMessage(error.message);
      } else {
        setForgotStatus("success");
        setForgotMessage(
          "Password reset instructions have been sent to your email.",
        );
      }
    } catch {
      setForgotStatus("error");
      setForgotMessage("An unexpected error occurred. Please try again.");
    }
  };

return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-95 max-md:w-85 px-3 py-1 space-y-5"
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

      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-lg font-bold text-neutral-900">
                Reset Password
              </h3>

              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-xs text-neutral-600">
              Enter your registered email address and we will send you
              instructions to reset your password.
            </p>

            <form
              onSubmit={handleForgotPassword}
              className="mt-4 space-y-4"
            >
              {forgotMessage && (
                <div
                  className={`rounded-xl p-3 text-xs ${
                    forgotStatus === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {forgotMessage}
                </div>
              )}

              <div>
                <label
                  htmlFor="forgot-email"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1"
                >
                  Email Address
                </label>

                <input
                  id="forgot-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={forgotStatus === "loading"}
                  className="rounded-xl bg-primary-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-600 disabled:opacity-50"
                >
                  {forgotStatus === "loading"
                    ? "Sending..."
                    : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}