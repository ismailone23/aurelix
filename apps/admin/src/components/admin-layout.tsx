'use client'
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
  Command
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
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
        ? "bg-blue-600 shadow-lg shadow-blue-500/20 text-white"
        : "text-zinc-400 hover:bg-white/5 hover:text-white"
        }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-zinc-500 group-hover:text-blue-400"} transition-colors`} />
      <span className="font-medium text-sm">{children}</span>
    </Link>
  );
}

function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 w-72 h-screen bg-zinc-950 text-white flex flex-col border-r border-white/5">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Command className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Aurelix</h1>
            <p className="text-xs text-zinc-500 font-medium tracking-wide">ADMINISTRATION</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-4 pb-2">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Overview</p>
        </div>
        <NavLink href="/" icon={LayoutDashboard}>
          Dashboard
        </NavLink>

        <div className="px-4 pb-2 pt-6">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Management</p>
        </div>
        <NavLink href="/products" icon={Package}>
          Products
        </NavLink>
        <NavLink href="/orders" icon={ShoppingCart}>
          Orders
        </NavLink>

        <div className="px-4 pb-2 pt-6">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</p>
        </div>
        <NavLink href="/orders/create" icon={PlusCircle}>
          Create Order
        </NavLink>
      </nav>

      {/* User info and logout */}
      <div className="p-4 m-4 rounded-xl bg-zinc-900/50 border border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-zinc-800 to-zinc-700 rounded-full flex items-center justify-center border border-white/10">
            <User className="w-5 h-5 text-zinc-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Administrator</p>
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-red-400 bg-red-500/5 border-red-500/10 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/20 transition-all font-medium h-9"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
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
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center animate-pulse shadow-xl shadow-blue-500/20">
            <Command className="w-6 h-6 text-white" />
          </div>
          <p className="text-zinc-400 text-sm font-medium animate-pulse">Initializing...</p>
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
    <div className="min-h-screen bg-zinc-50/50">
      <Sidebar />
      <main className="ml-72 min-h-screen p-8 max-w-7xl mx-auto animate-in fade-in duration-500">{children}</main>
    </div>
  );
}
