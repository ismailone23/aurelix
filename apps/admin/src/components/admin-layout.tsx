"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/auth-context";
import { Button } from "@workspace/ui/components/button";
import LoginPage from "../app/login/page";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  PlusCircle,
  LogOut,
  User,
  Store,
} from "lucide-react";

function NavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
          : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{children}</span>
    </Link>
  );
}

function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white flex flex-col shadow-xl z-50">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Aurelix
            </h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="text-xs uppercase tracking-wider text-gray-500 px-4 mb-3">
          Main Menu
        </p>
        <NavLink href="/" icon={LayoutDashboard}>
          Dashboard
        </NavLink>
        <NavLink href="/products" icon={Package}>
          Products
        </NavLink>
        <NavLink href="/orders" icon={ShoppingCart}>
          Orders
        </NavLink>

        <p className="text-xs uppercase tracking-wider text-gray-500 px-4 mb-3 mt-6">
          Quick Actions
        </p>
        <NavLink href="/orders/create" icon={PlusCircle}>
          Create Order
        </NavLink>
      </nav>

      {/* User info and logout */}
      <div className="p-4 border-t border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">Admin</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-red-400 border-red-900/50 hover:bg-red-950/50 hover:text-red-300 hover:border-red-800 transition-all"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // If on login page, just show the children (login form)
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Authenticated - show full admin layout
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <main className="ml-64 min-h-screen">{children}</main>
    </div>
  );
}
