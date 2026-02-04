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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 shadow-sm"
        : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 lg:px-8 py-4 flex gap-6 items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white hover:opacity-70 transition-opacity"
        >
          AURELIX
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/search"
            className="hidden md:flex p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white/98 dark:bg-neutral-950/98 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 shadow-lg transition-all duration-300 origin-top ${mobileMenuOpen
          ? "opacity-100 scale-y-100 visible"
          : "opacity-0 scale-y-95 invisible"
          }`}
      >
        <div className="container mx-auto px-4 py-6 flex flex-col gap-2">
          <Link
            href="/search"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-900/50 mb-4"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Search className="w-5 h-5 text-neutral-500" />
            <span className="text-base text-neutral-500">
              Search products...
            </span>
          </Link>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-3 text-lg font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
