"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { useBookingsStore } from "@/lib/store/bookings";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Check,
} from "lucide-react";
import { useState } from "react";

function NexusLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="7" fill="#0f172a" />
        <path d="M8 22 L8 10 L14 18 L14 10" stroke="#14b8a6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 10 L20 18 L20 10" stroke="#14b8a6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="16" r="2.5" fill="#10b981" />
      </svg>
      <span className="text-[15px] font-bold tracking-tight text-slate-900">NEXUS</span>
    </Link>
  );
}

const ROLE_NAV_LINKS: Record<string, { href: string; label: string }[]> = {
  user: [
    { href: "/resources", label: "Browse Resources" },
    { href: "/dashboard/user", label: "My Bookings" },
  ],
  owner: [
    { href: "/resources", label: "Browse Resources" },
    { href: "/dashboard/owner", label: "Owner Portal" },
  ],
  manager: [
    { href: "/resources", label: "Browse Resources" },
    { href: "/dashboard/manager", label: "Manager Operations" },
  ],
  admin: [
    { href: "/resources", label: "Browse Resources" },
    { href: "/dashboard/admin", label: "Platform Governance" },
  ],
};

const DEFAULT_LINKS = [{ href: "/resources", label: "Browse Resources" }];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuthStore();
  const { notifications, markNotificationsAsRead } = useBookingsStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const visibleLinks = currentUser
    ? ROLE_NAV_LINKS[currentUser.role] || DEFAULT_LINKS
    : DEFAULT_LINKS;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <NexusLogo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1 px-6">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                pathname.startsWith(link.href)
                  ? "text-teal-900 bg-teal-50 font-medium border border-teal-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Guide / How to Use Button in Top Right Corner */}
          <Link
            href="/guide"
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg border transition-all shadow-2xs",
              pathname === "/guide"
                ? "bg-[#065f46] text-white border-[#065f46]"
                : "text-teal-900 bg-teal-50/90 hover:bg-teal-100 border-teal-200"
            )}
            title="Read evaluation guide and how to use the platform"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-700" />
            <span>How to Use</span>
          </Link>

          {/* In-App Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                if (!notifOpen) markNotificationsAsRead();
              }}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl p-3 space-y-2 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-900">Activity Notifications</span>
                  <span className="text-[11px] text-slate-500">{notifications.length} alerts</span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2 divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div key={n.id} className="pt-2 first:pt-0 text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-[11px]">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-slate-800">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 capitalize">{currentUser.role}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md transition-colors font-medium"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-[#0f766e] hover:bg-[#115e59] text-white px-3.5 py-1.5 rounded-md transition-colors font-medium shadow-xs"
              >
                Get started
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="px-4 py-3 flex flex-col gap-1">
            <Link
              href="/guide"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "px-3 py-2.5 text-sm rounded-md transition-colors font-bold",
                pathname === "/guide"
                  ? "text-teal-900 bg-teal-50"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              📖 How to Use (Platform Guide)
            </Link>
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-3 py-2.5 text-sm rounded-md transition-colors",
                  pathname.startsWith(link.href)
                    ? "text-teal-900 bg-teal-50 font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
