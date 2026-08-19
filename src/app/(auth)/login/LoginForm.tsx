"use client";
import { Field, Input, Button } from "@/component";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAuthInput, createAuthSchema } from "@/lib/validation/input";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateAuthInput>({
    resolver: zodResolver(createAuthSchema),
    defaultValues: {
      //name: "",
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
      className="w-95 px-3 py-1 space-y-5"
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
      <Field
        label="Password"
        htmlFor="password"
        error={errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          autoComplete="password"
          placeholder="********"
          {...register("password")}
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
