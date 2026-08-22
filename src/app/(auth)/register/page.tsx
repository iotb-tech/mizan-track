import { Metadata } from "next";
import { RegisterForm } from "./RegisterForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Account • Mizan Track",
  description: "Create an account on Mizan Track to build habits and track expenses.",
};

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          Create Account
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Get started with your free account in seconds.
        </p>
      </div>

      <RegisterForm />

      <div className="mt-6 border-t border-neutral-100 pt-5 text-center">
        <p className="text-sm text-neutral-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary-600 hover:text-primary-700 hover:underline transition"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

