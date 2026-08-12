import { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata ={ title: "Sign in"}
export default function LoginPage(){
    return ( 
      <div
        className="w-full max-w-95 bg-neutral-400 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)];
 border-neutral-600/20 flex flex-col mt-3 "
      >
        <div>Mizan Track</div>
        <LoginForm />
      </div>
    );
} 