"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import NavLink from "./navlink";
import { Search, Sun, Moon, Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/contactus", label: "Contact Us" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="shadow-sm sticky top-0 z-40 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-3 flex gap-6 items-center justify-between">
        <Link
          href="/"
          className="text-[22px] font-bold text-purple-600 dark:text-purple-400"
        >
          Aurelix
        </Link>

        <div className="hidden md:flex gap-1 items-center">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/search"
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4 text-neutral-500" />
            <span className="text-sm text-neutral-500">Search...</span>
          </Link>

          <Link
            href="/cart"
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>

          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-neutral-400" />
              ) : (
                <Moon className="w-5 h-5 text-neutral-600" />
              )}
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
        <div className="md:hidden absolute top-full left-0 right-0 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            <Link
              href="/search"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 mb-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search className="w-4 h-4 text-neutral-500" />
              <span className="text-sm text-neutral-500">
                Search products...
              </span>
            </Link>

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
