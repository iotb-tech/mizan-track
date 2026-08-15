"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoM } from ".";


type Linkprop = {
  name: string;
  href: string;
  id: string;
};

export const links: Linkprop[] = [
  { name: "Home", href: "/welcome", id: "home" },
  { name: "Login", href: "/login", id: "login" },
  { name: "Register", href: "/register", id: "register" },
];
export function NavBar(){
    const pathname = usePathname();
    return (
      <nav>
        <div>
          <ul className="flex gap-10">
            {links.map((link) => (
              <li
                key={link.id}
                className={`font-semibold ${pathname === link.href ? "border-b-2" : ""} border-b-primary-500`}
              >
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
}

export function DashboardNav({name}: {name:string}){

  return (
    <header className="flex items-center gap-4 px-6 borber-b border-b-neutral-900 py-2 h-[4rem]">
      <Link href="/dashboard">
        <div className="flex gap-4 items-center ">
        <LogoM />
          <p className="text-2xl mt-4 font-medium">Dashboard</p>
        </div>
      </Link>
      <div className="flex-1" />
      <span className="text-xs text-neutral-800">{name}</span>

    </header>
  );

}