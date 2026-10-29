"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

// ─── NexusLogo ────────────────────────────────────────────────────────────────
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
export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [role, setRole] = useState<"user" | "owner">("user");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Demo: redirect immediately after short delay
    setTimeout(() => {
      router.push("/resources");
    }, 400);
  }

  return (
    <div className="min-h-screen bg-[#fbfbfa] flex flex-col items-center justify-center px-4 py-16 text-slate-800">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8">
          <NexusLogo />
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-7 flex flex-col gap-6 shadow-xs">
          {/* Header */}
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              Create your NEXUS account
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Join the network to discover and share institutional resources.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateAccount} className="flex flex-col gap-4">
            <Input
              label="Full name"
              type="text"
              placeholder="Arjun Mehta"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@institution.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              label="Organisation"
              type="text"
              placeholder="MIT, Stanford, Horizon Hub..."
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
            />

            {/* Role select */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="role-select"
                className="text-sm text-slate-700 font-medium"
              >
                Role
              </label>
              <select
                id="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value as "user" | "owner")}
                className="w-full bg-white border border-slate-300 rounded-md text-sm text-slate-900 h-9 px-3 py-2 transition-colors duration-150 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 appearance-none shadow-2xs"
              >
                <option value="user">User — browse and book resources</option>
                <option value="owner">Resource Owner — list and manage resources</option>
              </select>
            </div>

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              hint="Minimum 8 characters"
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-1 font-bold shadow-xs"
            >
              Create account
            </Button>
          </form>

          {/* Login link */}
          <p className="text-center text-xs text-slate-500 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-700 hover:text-teal-800 font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-slate-500 mt-5">
          By creating an account you agree to the{" "}
          <Link href="/terms" className="text-slate-600 hover:text-slate-800 transition-colors underline underline-offset-2">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-slate-600 hover:text-slate-800 transition-colors underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
