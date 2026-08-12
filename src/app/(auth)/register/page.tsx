import { RegisterForm } from "./RegisterForm"
import Link from "next/link";

export default function page() {
  return (
    <>
      <h2 className=" text-2xl my-5 ">Create An Account</h2>
      <RegisterForm />
      <p className="mb-6 text-center">
        Already have an account ,{" "}
        <Link href="/login" className="text-primary-500">
          Log in
        </Link>
      </p>
    </>
  );
}
