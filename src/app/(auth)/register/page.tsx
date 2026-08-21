import { RegisterForm } from "./RegisterForm"
import Link from "next/link";

export default function page() {
  return (
    <>
      <div className="my-5 px-3">
        <h2 className=" text-2xl mb-2 font-bold tracking-wide">
          Create your account
        </h2>
        <p className="text-sm text-neutral-600">It takes less than a minute.</p>
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
