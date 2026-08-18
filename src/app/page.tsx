import { NavBar } from "@/component/nav-bar";
import { Hero } from "@/component/hero";
import { Features } from "@/component/features";

export default function Home() {
  return (
    <main className="min-h-screen">
      <NavBar />
      <Hero />
      <Features/>
    </main>
  );
}