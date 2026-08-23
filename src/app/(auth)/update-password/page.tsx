import { Metadata } from "next";
import { UpdatePassword } from "./UpdatePassword";

export const metadata: Metadata = { title: "Change your password" };
export default function Page() {
  return (
    <>
      <div className="my-5 px-3">
        <h2 className=" text-2xl mb-2 font-bold tracking-wide">
          Change your password
        </h2>
        <p className="text-sm text-neutral-600">Enter your new Password.</p>
      </div>
      <UpdatePassword />
    </>
  );
}
