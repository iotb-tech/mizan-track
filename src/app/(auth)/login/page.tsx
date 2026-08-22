import { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In • Mizan Track",
  description: "Sign in to your Mizan Track account to manage habits and expenses.",
};

export default function LoginPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          Sign In
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Enter your details below to continue.
        </p>
      </div>

      <LoginForm />

      <div className="mt-6 border-t border-neutral-100 pt-5 text-center">
        <p className="text-sm text-neutral-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary-600 hover:text-primary-700 hover:underline transition"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
 
