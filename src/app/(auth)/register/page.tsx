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
      <p className="mb-6 px-6 mt-3max-md:text-base">
        Already have an account ,{" "}
        <Link href="/login" className="text-primary-500">
          Log in
        </Link>
      </p>
    </>
  );
}

