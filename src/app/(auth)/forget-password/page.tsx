import { Metadata } from "next";
import Link from "next/link";
import { ForgotPassword } from "./ForgetForm";

export const metadata: Metadata = { title: "Reset Password" };
export default function Page() {
  return (
    <>
      <div className="my-5 px-3">
        <h2 className=" text-2xl mb-2 font-bold tracking-wide">
          Reset Password
        </h2>
        <p className="text-sm text-neutral-600">
          Enter your details to continue.
        </p>
      </div>
      <ForgotPassword />
      <p className="max-md:text-base text-left px-3">
       
        <Link href="/login" className="text-primary-500">
         
        </Link>
      </p>
    </>
  );
}
