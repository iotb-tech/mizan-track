import { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata ={ title: "Sign in"}
export default function LoginPage(){
    return ( 
      <div
        className="min-h-screen flex flex-col justify-center items-center"
      >
        <div>Mizan Track</div>
        <LoginForm />
      </div>
    );
} 