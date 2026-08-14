"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";


type Linkprop = {
  name: string;
  href: string;
  id: string;
};

export const links: Linkprop[] = [
  { name: "Home", href: "/welcome", id: crypto.randomUUID() },
  { name: "Login", href: "/login", id: crypto.randomUUID() },
  { name: "Register", href: "/register", id: crypto.randomUUID() },
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