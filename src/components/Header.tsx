"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const links = [
    { label: "Cadastro", href: "/cadastro" },
    { label: "Histórico", href: "/historico" },
    { label: "Sorteio", href: "/" },
  ];

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-center space-x-8 font-sans">
      {links.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className={`hover:underline ${
            pathname === href ? "font-bold underline" : ""
          }`}
        >
          {label}
        </Link>
      ))}
    </header>
  );
}
