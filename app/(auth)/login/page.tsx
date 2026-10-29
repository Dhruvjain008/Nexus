"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore, DEMO_USERS } from "@/lib/store/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UserRole } from "@/lib/types";

// Role card — maps to a demo user
function RoleQuickCard({
  id,
  label,
  role,
  description,
  onSelect,
}: {
  id: string;
  label: string;
  role: UserRole;
  description: string;
  onSelect: (id: string) => void;
}) {
  const roleColors: Record<UserRole, string> = {
    user: "text-blue-700 bg-blue-50 border-blue-200",
    owner: "text-emerald-800 bg-emerald-50 border-emerald-200",
    manager: "text-amber-800 bg-amber-50 border-amber-200",
    admin: "text-rose-800 bg-rose-50 border-rose-200",
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="flex flex-col gap-1.5 p-3 bg-white border border-slate-200/90 rounded-lg text-left hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs w-full cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide border ${roleColors[role]}`}
        >
          {role.toUpperCase()}
        </span>
      </div>
      <p className="text-xs font-bold text-slate-900">{label}</p>
      <p className="text-[11px] text-slate-500 leading-snug">{description}</p>
    </button>
  );
}

// ─── NexusLogo (minimal) ──────────────────────────────────────────────────────
function NexusLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 justify-center">
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="7" fill="#0f172a" />
        <path d="M8 22 L8 10 L14 18 L14 10" stroke="#14b8a6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 10 L20 18 L20 10" stroke="#14b8a6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="16" r="2.5" fill="#10b981" />
      </svg>
      <span className="text-[15px] font-bold tracking-tight text-slate-900">NEXUS</span>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Demo: always log in as user-1
    setTimeout(() => {
      login("user-1");
      router.push("/resources");
    }, 400);
  }

  function handleDemoSelect(userId: string) {
    login(userId);
    router.push("/resources");
  }

  return (
    <div className="min-h-screen bg-[#fbfbfa] flex flex-col items-center justify-center px-4 py-16 text-slate-800">
      {/* Card */}
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8">
          <NexusLogo />
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-7 flex flex-col gap-6 shadow-xs">
          {/* Header */}
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">Sign in to NEXUS</h1>
            <p className="text-sm text-slate-500 mt-1">
              Enter your credentials to access your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@institution.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <Button type="submit" variant="primary" size="md" loading={loading} className="w-full mt-1 font-bold shadow-xs">
              Sign in
            </Button>
          </form>

          {/* Signup link */}
          <p className="text-center text-xs text-slate-500 font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-teal-700 hover:text-teal-800 font-bold transition-colors">
              Create one
            </Link>
          </p>
        </div>

        {/* Demo quick access */}
        <div className="mt-5 bg-white border border-slate-200/90 rounded-xl p-5 flex flex-col gap-4 shadow-xs">
          <div>
            <p className="text-xs font-bold text-slate-700 mb-0.5">Demo quick access</p>
            <p className="text-[11px] text-slate-500">
              Select a role to instantly sign in as a demo account.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_USERS.map((u) => (
              <RoleQuickCard
                key={u.id}
                id={u.id}
                label={u.label}
                role={u.role}
                description={u.description}
                onSelect={handleDemoSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
