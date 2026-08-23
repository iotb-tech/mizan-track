import { Metadata } from "next";
import Link from "next/link";
import { ForgotPassword } from "./ForgetForm";

export const metadata: Metadata = { title: "Reset Password" };

export default function Page() {
  return (
    <>
      <div className="my-5 px-3">
        <h2 className="text-2xl mb-2 font-bold tracking-wide">
          Reset Password
        </h2>
        <p className="text-sm text-neutral-600">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <ForgotPassword />

      <p className="text-sm text-left px-3 mt-4 mb-7">
        Remember your password?{" "}
        <Link href="/login" className="text-primary-500 font-medium">
          Back to Login
        </Link>
      </p>
    </>
  );
}
