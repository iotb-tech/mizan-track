import { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import Link from "next/link";

export const metadata: Metadata ={ title: "Sign in"}
export default function Page(){
    return (
      <>
        <div className="my-5 px-3">
          <h2 className=" text-2xl mb-2 font-bold tracking-wide">Sign in</h2>
          <p className="text-sm text-neutral-600">
            Enter your details to continue.
          </p>
        </div>
        <LoginForm />
        <p className="max-md:text-base text-left px-3">
          Do not have an account,{" "}
          <Link href="/register" className="text-primary-500">
            Create an account
          </Link>
        </p>
        <div className="max-md:text-base mt-5 mb-7">
          <Link href="/" className="px-3 text-warning/90">
            Forgot password →
          </Link>
        </div>
      </>
    );
} 
