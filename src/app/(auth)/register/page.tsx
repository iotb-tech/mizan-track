import { Metadata } from "next";
import { RegisterForm } from "./RegisterForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Account • Mizan Track",
  description: "Create an account on Mizan Track to build habits and track expenses.",
};

export default function RegisterPage() {
  return (
    <>
      <div className="mb-5 mt-5 px-3">
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          Create Account
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Get started with your free account in seconds.
        </p>
      </div>

      <RegisterForm />

      <p className="text-sm text-left px-3 mt-3 mb-7">
        Already have an account?{" "}
        <Link href="/login" className="text-primary-500 font-medium">
          Log in
        </Link>
      </p>
    </>
  );
}
