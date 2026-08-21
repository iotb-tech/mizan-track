"use client";

import { Button, Field, Input } from "@/component";
import { createClient } from "@/lib/supabase/client";
import { CreateForgotSchema, forgotSchema } from "@/lib/validation/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function ForgotPassword() {
  const supabase = createClient();
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
    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/update-password`,
      },
    );

    if (authError) {
      setError("root", { message: authError.message });
      return;
    } else {
      setError("root", { message: "Check your email for the reset link!" });
    }
  };
  return (
    <form
      action=""
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-95 max-md:w-85 px-3 py-1 space-y-5"
    >
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />
      </Field>
      {errors.root && (
        <p className="text-error" role="alert">
          {errors.root.message}
        </p>
      )}
      <Button variant="auth" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Loading..." : "Sign in"}
      </Button>
    </form>
  );
}
