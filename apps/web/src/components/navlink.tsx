"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  label: string;
}

export default function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  // For home page, only match exact "/", for others check if pathname starts with href
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
        isActive
          ? "text-purple-600 dark:text-purple-400"
          : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
      }`}
    >
      {label}
    </Link>
  );
}
