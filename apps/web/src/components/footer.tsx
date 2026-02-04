import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  const legalLinks = [
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/about", label: "About Us" },
    { href: "/faq", label: "FAQ" },
  ];

  const supportLinks = [
    { href: "/contactus", label: "Contact Support" },
    { href: "/shipping", label: "Shipping Info" },
    { href: "/returns", label: "Returns" },
    { href: "/faq", label: "Help Center" },
  ];

  return (
    <footer className="bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Company Info */}
          <div className="flex flex-col">
            <h3 className="text-xl font-serif italic mb-4 text-neutral-900 dark:text-white">
              Aurelix
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Premium fragrances for men and women. Discover our exclusive
              collection of perfumes that express your unique style and
              personality.
            </p>
          </div>

          {/* Column 2: Social Media */}
          <div className="flex flex-col">
            <h4 className="font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
              Follow Us
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 3: Legal & Info */}
          <div className="flex flex-col">
            <h4 className="font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
              Legal
            </h4>
            <div className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Support */}
          <div className="flex flex-col">
            <h4 className="font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
              Support
            </h4>
            <div className="flex flex-col gap-2">
              {supportLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 py-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center items-start gap-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              © {currentYear} Aurelix. All rights reserved.
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              Designed by Ismail Hossain
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
