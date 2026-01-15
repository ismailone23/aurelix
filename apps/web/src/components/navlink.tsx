"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  label: string;
}

export default function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-2 py-1 text-sm rounded-md font-medium transition-colors duration-200 ${
        isActive
          ? "font-bold bg-neutral-200 dark:bg-neutral-800"
          : "bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800"
      }`}
    >
      {label}
    </Link>
  );
}
