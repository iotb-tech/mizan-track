"use client";
import { Field, Input } from "@/component";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAuthInput, createAuthSchema } from "@/lib/validation/input";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/* By Ibnu Ridor */

export function RegisterForm() {
  const supabase = createClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateAuthInput>({
    resolver: zodResolver(createAuthSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: CreateAuthInput) => {
    const { name, email, password } = data;

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      setError("root", {
        message: error.message,
      });
      return;
    }

    if (!authData.user) {
      setError("root", {
        message: "Unable to create account. Please try again.",
      });
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-95 max-md:w-85 px-3 py-1 space-y-3"
    >
      <Field label="Full Name" htmlFor="name" error={errors.name?.message}>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          autoComplete="name"
          {...register("name")}
        />
      </Field>

      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />
      </Field>

      <Field
        label="Password"
        htmlFor="password"
        error={errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="new-password"
          {...register("password")}
        />
      </Field>

      {errors.root?.message && (
        <p className="mt-2 text-sm text-red-500">{errors.root.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full text-neutral-50 text-base rounded-lg px-4 py-3 disabled:cursor-not-allowed disabled:opacity-50 font-extrabold bg-primary-500"
      >
        {isSubmitting ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
