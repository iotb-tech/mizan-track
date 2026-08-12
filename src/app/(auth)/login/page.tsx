import { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import Link from "next/link";

export const metadata: Metadata ={ title: "Sign in"}
export default function Page(){
    return (
      <>
        <h2 className="text-center text-2xl mt-5">Mizan Track</h2>
        <LoginForm />
        <p className="mb-6 text-center">
          Do not have an account,{" "}
          <Link href="/register" className="text-primary-500">
            Create an account
          </Link>
        </p>
      </>
    );
} 