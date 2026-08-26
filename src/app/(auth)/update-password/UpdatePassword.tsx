"use client";
import { createClient } from "@/lib/supabase/client";
import { CreateUpdatePass, updatePasswordSchema } from "@/lib/validation/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function UpdatePassword() {
  const supabase = createClient();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateUpdatePass>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: CreateUpdatePass) => {
    const { password } = data;
    const { error: authError } = await supabase.auth.updateUser({
      password: password,
    });

    if (authError) {
      setError("root", { message: authError.message });
      return;
    }

    setSuccessMessage("✓ Password updated! Redirecting to login...");
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full px-3 py-1 space-y-5"
    >
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
        >
          New Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="new-password"
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
          <p className="mt-1 text-xs text-red-600" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5"
        >
          Confirm Password
        </label>

        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
          >
            {showConfirm ? "🙈" : "👁"}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p className="text-xs text-red-600 font-medium" role="alert">
          {errors.root.message}
        </p>
      )}

      {successMessage && (
        <p className="rounded-xl bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700 font-medium" role="status">
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-xl bg-primary-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
