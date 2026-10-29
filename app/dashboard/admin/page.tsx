"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AuditLedger } from "@/components/bookings/AuditLedger";
import { useBookingsStore } from "@/lib/store/bookings";
import { ORGANISATIONS, RESOURCES, USERS } from "@/lib/data";
import {
  ShieldCheck,
  Building2,
  Users,
  HardDrive,
  FileCheck,
  CheckCircle2,
  XCircle,
  DownloadCloud,
  SlidersHorizontal,
} from "lucide-react";
import type { Organisation } from "@/lib/types";

export default function AdminDashboard() {
  const { bookings, auditEvents } = useBookingsStore();
  const [orgs, setOrgs] = useState<Organisation[]>(ORGANISATIONS);
  const [dualSignoffRequired, setDualSignoffRequired] = useState(true);
  const [antiHoardingEnabled, setAntiHoardingEnabled] = useState(true);
  const [strictTier3Gating, setStrictTier3Gating] = useState(true);

  const toggleOrgVerification = (id: string) => {
    setOrgs((prev) =>
      prev.map((o) => (o.id === id ? { ...o, verified: !o.verified } : o))
    );
  };

  const handleExportComplianceReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-800">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-semibold shadow-2xs">
                Root Governance
              </span>
              <span className="text-xs text-slate-500 font-medium">· NEXUS Network Federation</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
              Platform Administration & Integrity
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Federated network oversight, cryptographic audit trail verification, and institutional vetting.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportComplianceReport}
            className="flex items-center gap-2 bg-white border-slate-300 shadow-xs"
          >
            <DownloadCloud className="w-4 h-4 text-slate-500" />
            Export Compliance Bundle
          </Button>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4 flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{orgs.length}</p>
                <p className="text-xs text-slate-500 font-medium">Member Institutions</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-4 flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{RESOURCES.length}</p>
                <p className="text-xs text-slate-500 font-medium">Audited Resources</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-4 flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{USERS.length}</p>
                <p className="text-xs text-slate-500 font-medium">Verified Personnel</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-4 flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{auditEvents.length}</p>
                <p className="text-xs text-slate-500 font-medium">Immutable Audit Entries</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Member Organizations Table */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-700" />
              Institutional Member Roster
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Only verified entities may list hazardous Tier 2 & Tier 3 scientific assets on the public directory.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-600 bg-slate-50/80 font-semibold">
                <tr>
                  <th className="px-4 py-3">Institution</th>
                  <th className="px-4 py-3">Sector</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Listed Assets</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orgs.map((org) => (
                  <tr key={org.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">{org.name}</td>
                    <td className="px-4 py-3 capitalize text-slate-600 font-medium">{org.type}</td>
                    <td className="px-4 py-3 text-slate-500">{org.location}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{org.resourceCount} units</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-2xs ${
                          org.verified
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {org.verified ? "Accredited" : "Pending Audit"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant={org.verified ? "ghost" : "primary"}
                        size="sm"
                        onClick={() => toggleOrgVerification(org.id)}
                      >
                        {org.verified ? "Suspend Auth" : "Approve Accreditation"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform Safety & Policy Parameters */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              Network Protocol Parameters
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Platform-wide safety constraints enforced automatically across all member organizations.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-900">Mandatory Dual-Party Condition Sign-Off</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Require both borrower and equipment custodian to digitally sign pre-use and post-return checklists.
                </p>
              </div>
              <Button
                variant={dualSignoffRequired ? "secondary" : "outline"}
                size="sm"
                onClick={() => setDualSignoffRequired(!dualSignoffRequired)}
              >
                {dualSignoffRequired ? "Enforced" : "Optional"}
              </Button>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-900">Algorithmic Anti-Hoarding Dampening</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automatically lower waitlist priority for accounts exceeding 20 reservation hours in a rolling 30-day window.
                </p>
              </div>
              <Button
                variant={antiHoardingEnabled ? "secondary" : "outline"}
                size="sm"
                onClick={() => setAntiHoardingEnabled(!antiHoardingEnabled)}
              >
                {antiHoardingEnabled ? "Enforced" : "Disabled"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Tier 3 Supervised Asset Gating</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Block self-serve reservation for heavy machining or biosafety apparatus without documented faculty sign-off.
                </p>
              </div>
              <Button
                variant={strictTier3Gating ? "secondary" : "outline"}
                size="sm"
                onClick={() => setStrictTier3Gating(!strictTier3Gating)}
              >
                {strictTier3Gating ? "Enforced" : "Relaxed"}
              </Button>
            </div>
          </div>
        </div>

        {/* Global Cryptographic Ledger View */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Cryptographic Audit Ledger (Global Feed)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Append-only sequential event chain. Authorized personnel cannot silently mutate logged records.
            </p>
          </div>

          <AuditLedger events={auditEvents} />
        </div>
      </main>
    </div>
  );
}
