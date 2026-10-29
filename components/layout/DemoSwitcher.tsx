"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, DEMO_USERS } from "@/lib/store/auth";
import { useBookingsStore } from "@/lib/store/bookings";
import { cn } from "@/lib/utils";
import {
  Users,
  ChevronDown,
  Check,
  RotateCcw,
  X,
  Sparkles,
  ArrowRight,
  LogOut,
  HelpCircle,
} from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  user: "text-blue-700",
  owner: "text-emerald-800",
  manager: "text-amber-800",
  admin: "text-rose-800",
};

const ROLE_BG: Record<string, string> = {
  user: "bg-blue-50 border-blue-200",
  owner: "bg-emerald-50 border-emerald-200",
  manager: "bg-amber-50 border-amber-200",
  admin: "bg-rose-50 border-rose-200",
};

const ROLE_AVATAR: Record<string, string> = {
  user: "bg-blue-600 text-white",
  owner: "bg-emerald-700 text-white",
  manager: "bg-amber-600 text-white",
  admin: "bg-rose-600 text-white",
};

const ROLE_DASHBOARDS: Record<string, string> = {
  user: "/dashboard/user",
  owner: "/dashboard/owner",
  manager: "/dashboard/manager",
  admin: "/dashboard/admin",
};

export function DemoSwitcher() {
  const [open, setOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const { currentUser, login, logout } = useAuthStore();
  const { resetToInitialData } = useBookingsStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const dismissed = sessionStorage.getItem("nexus_demo_guide_dismissed");
    if (dismissed === "true") {
      setShowGuide(false);
    }
  }, []);

  const dismissGuide = () => {
    setShowGuide(false);
    sessionStorage.setItem("nexus_demo_guide_dismissed", "true");
  };

  const handleSelectRole = (u: (typeof DEMO_USERS)[number]) => {
    login(u.id);
    setOpen(false);
    dismissGuide();

    // If on a dashboard, root, or auth pages, seamlessly navigate to the new role's dashboard
    if (
      pathname.startsWith("/dashboard") ||
      pathname === "/" ||
      pathname === "/login" ||
      pathname === "/signup"
    ) {
      router.push(ROLE_DASHBOARDS[u.role]);
    } else {
      // If inspecting a specific resource or booking lifecycle, refresh current view in-place
      router.refresh();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* ── Dotted Arrow Guide Pop-up ────────────────────────────────────────── */}
      {showGuide && !open && (
        <div className="relative mb-2 bg-white border border-slate-200/90 rounded-xl p-3 shadow-lg w-60 sm:w-64 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold">
              <Sparkles className="w-2.5 h-2.5 text-teal-600" />
              Demo Switcher
            </div>
            <button
              type="button"
              onClick={dismissGuide}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-0.5 rounded-full transition-colors cursor-pointer"
              title="Close message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
            Click to switch roles anytime: <strong className="text-slate-800">User</strong>, <strong className="text-slate-800">Owner</strong>, <strong className="text-slate-800">Manager</strong> &amp; <strong className="text-slate-800">Admin</strong>.
          </p>

          <button
            type="button"
            onClick={() => {
              handleSelectRole(DEMO_USERS[0]);
              dismissGuide();
            }}
            className="w-full mt-2 py-1 px-2.5 text-[11px] font-bold text-white bg-[#0f766e] hover:bg-[#115e59] rounded-lg transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
          >
            Start as User (Arjun)
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* Dotted Arrow SVG Connector pointing straight at the button */}
          <div className="absolute -bottom-4 right-8 pointer-events-none">
            <svg width="28" height="18" viewBox="0 0 28 18" fill="none" className="text-teal-600">
              <path
                d="M 3 0 Q 3 10, 18 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeDasharray="3 2"
                strokeLinecap="round"
                fill="none"
              />
              <polygon points="16,8 24,13 15,16" fill="currentColor" />
            </svg>
          </div>
        </div>
      )}

      {/* ── Switcher Dropdown Menu ───────────────────────────────────────────── */}
      {open && (
        <div className="mb-2 bg-white border border-slate-200 rounded-xl shadow-2xl w-80 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Demo Scenarios
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Switch role to explore full lifecycle</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="py-1">
            {DEMO_USERS.map((u) => (
              <button
                key={u.id}
                onClick={() => handleSelectRole(u)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors cursor-pointer",
                  currentUser?.id === u.id && "bg-teal-50/70 border-l-2 border-teal-600"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-xs",
                    ROLE_AVATAR[u.role]
                  )}
                >
                  <span>{u.label.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 truncate">{u.label}</span>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.2 rounded font-semibold capitalize border",
                        ROLE_BG[u.role],
                        ROLE_COLORS[u.role]
                      )}
                    >
                      {u.role}
                    </span>
                    {currentUser?.id === u.id && (
                      <Check className="w-3.5 h-3.5 text-teal-600 ml-auto flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{u.description}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-2">
            {currentUser ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                  setOpen(false);
                  router.push("/");
                }}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-rose-700 transition-colors whitespace-nowrap cursor-pointer"
                title="Switch back to public guest view"
              >
                <LogOut className="w-3 h-3" />
                Guest View
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGuide(true);
                  setOpen(false);
                }}
                className="flex items-center gap-1 text-[11px] font-medium text-teal-700 hover:text-teal-800 transition-colors whitespace-nowrap cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" />
                Show Guide
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                resetToInitialData();
                router.refresh();
              }}
              className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-teal-700 transition-colors whitespace-nowrap cursor-pointer"
              title="Clear all test bookings and reset to initial clean state"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Data
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Role Switcher Pill Widget ───────────────────────────────── */}
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (showGuide) setShowGuide(false);
        }}
        className={cn(
          "flex items-center gap-2.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 shadow-md hover:shadow-lg cursor-pointer",
          "bg-white border border-slate-200 text-slate-800",
          open && "ring-2 ring-teal-600/20 border-teal-600"
        )}
      >
        <div className="w-6 h-6 rounded-full bg-[#065f46] text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0 shadow-xs">
          {currentUser ? (
            currentUser.role.charAt(0).toUpperCase()
          ) : (
            <Users className="w-3.5 h-3.5" />
          )}
        </div>
        <div className="text-left pr-0.5">
          <div className="text-xs font-bold text-slate-900 leading-tight">
            {currentUser
              ? `${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} View`
              : "User Scenario"}
          </div>
          <div className="text-[10px] text-slate-500 leading-tight">
            {currentUser ? currentUser.name : "Switch role to test"}
          </div>
        </div>
        <ChevronDown
          className={cn("w-3.5 h-3.5 text-slate-400 transition-transform ml-0.5", open && "rotate-180")}
        />
      </button>
    </div>
  );
}
