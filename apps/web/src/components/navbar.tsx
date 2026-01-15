"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import NavLink from "./navlink";
import { Input } from "@workspace/ui/components/input";
import { Search, Sun, Moon, Menu, X, ShoppingCart } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/mens", label: "Mens" },
  { href: "/womens", label: "Womens" },
  { href: "/contactus", label: "Contact Us" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="shadow-md sticky top-0 z-40 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4 py-3 flex gap-6 items-center justify-between">
        <Link href="/" className="text-[22px] font-bold">
          Aurelex
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center px-2 py-2 md:px-3 rounded-md bg-neutral-200 dark:bg-neutral-800">
            <Input
              placeholder="Search"
              className="border-none bg-transparent shadow-none p-0 ring-0  focus-visible:border-none focus-visible:outline-0 focus-visible:ring-0 text-sm h-auto"
            />
            <Search className="w-4 h-4 md:w-5 md:h-5" />
          </div>

          <Link
            href="/cart"
            className="p-1.5 md:p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
          </Link>

          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-1.5 md:p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Moon className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 border-t border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 animate-in slide-in-from-top">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-3">
            <div className="flex items-center px-2 py-2 rounded-md bg-neutral-200 dark:bg-neutral-800">
              <Input
                placeholder="Search"
                className="border-none bg-transparent shadow-none p-0 ring-0 focus-visible:border-none focus-visible:outline-0 focus-visible:ring-0 text-sm h-auto"
              />
              <Search className="w-4 h-4" />
            </div>

            {navLinks.map((link) => (
              <div key={link.href} onClick={() => setMobileMenuOpen(false)}>
                <NavLink href={link.href} label={link.label} />
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
