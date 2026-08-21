"use client";
import { Button, Field, Input } from "@/component";
import { createClient } from "@/lib/supabase/client";
import { CreateUpdatePass, updatePasswordSchema } from "@/lib/validation/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function UpdatePassword() {
  const supabase = createClient();
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
    const {password} = data;
    const {error: authError } = await supabase.auth.updateUser({
        password: password
    });

    if(authError){
        setError("root", {message: authError.message})
        return;
    } else {
        setError("root", {message: " Password updated successfully!"})
    }
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-95 max-md:w-85 px-3 py-1 space-y-5"
    >
      <Field
        label="New Password"
        htmlFor="password"
        error={errors.password?.message}
      >
        <Input
          type="password"
          id="password"
          autoComplete="password"
          placeholder="********"
          {...register("password")}
        />
      </Field>
      <Field
        label="Confirm Password"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
      >
        <Input
          type="password"
          id="confirmPassword"
          autoComplete="Confirm Password"
          placeholder="********"
          {...register("confirmPassword")}
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
