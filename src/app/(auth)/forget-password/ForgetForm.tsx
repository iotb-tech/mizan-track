"use client";

import { createClient } from "@/lib/supabase/client";
import { CreateForgotSchema, forgotSchema } from "@/lib/validation/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

export function ForgotPassword() {
  const supabase = createClient();
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateForgotSchema>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: CreateForgotSchema) => {
    const { email } = data;
    setSuccessMessage("");

    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
      },
    );

    if (authError) {
      setError("root", { message: authError.message });
      return;
    }

    setSuccessMessage("Check your email — a reset link has been sent!");
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
          <p className="mt-1 text-xs text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p className="text-xs text-red-600" role="alert">
          {errors.root.message}
        </p>
      )}

      {successMessage && (
        <p className="rounded-xl bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700">
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-xl bg-primary-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
}
