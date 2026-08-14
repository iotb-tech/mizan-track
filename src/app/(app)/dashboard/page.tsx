"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import { Button } from "@/component";

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();

  async function logOut() {
    await supabase.auth.signOut();

    router.refresh();
    router.push("/login");
  }


  return (
    <main className="min-h-screen bg-neutral-200">
      <div className="flex min-h-screen flex-col items-center justify-center mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-neutral-900">
          Consistency Tracker
        </h1>
        <p className="mt-4 text-neutral-600">Fellows consistency tracker.</p>
        <p>This is Dashboard</p>
        <Button variant="error" onClick={logOut}>Log out</Button>
      </div>
    </main>
  );
}
