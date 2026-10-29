"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Textarea } from "@/components/ui/Input";
import { useAuthStore } from "@/lib/store/auth";
import { useBookingsStore } from "@/lib/store/bookings";
import { INCIDENTS, RESOURCES, ORGANISATIONS } from "@/lib/data";
import { formatDateTime, formatDuration, cn } from "@/lib/utils";
import type { Incident, IncidentSeverity, Booking } from "@/lib/types";
import {
  ShieldAlert,
  Sliders,
  CalendarCheck,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Layers,
  FileText,
  UserCheck,
} from "lucide-react";

export default function ManagerDashboard() {
  const { currentUser } = useAuthStore();
  const { bookings, incidents, resolveIncident } = useBookingsStore();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [resolutionText, setResolutionText] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const managerOrg = ORGANISATIONS.find((o) => o.id === "org-1") || ORGANISATIONS[0];

  const handleResolveIncident = (incidentId: string) => {
    if (!resolutionText.trim()) return;
    resolveIncident(incidentId, currentUser?.name || "Vikram Malhotra (Manager)", resolutionText.trim());
    setSelectedIncident(null);
    setResolutionText("");
  };

  const openIncidents = incidents.filter((i) => i.status !== "resolved");
  const waitlistedBookings = bookings.filter((b) => b.status === "WAITLISTED");
  const activeBookings = bookings.filter((b) => ["CHECKED_OUT", "APPROVED"].includes(b.status));

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-800">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold shadow-2xs">
                Institutional Governance
              </span>
              <span className="text-xs text-slate-500 font-medium">· {managerOrg.name}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
              Operations & Risk Management
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Review safety incidents, audit waitlist allocations, and arbitrate condition disputes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 bg-white border border-slate-200 rounded-lg shadow-xs text-right">
              <p className="text-[11px] text-slate-400 font-medium">Supervised Assets</p>
              <p className="text-sm font-bold text-slate-900">{RESOURCES.length} Units Active</p>
            </div>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4 flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{openIncidents.length}</p>
                <p className="text-xs text-slate-500 font-medium">Open Incidents</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-4 flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{activeBookings.length}</p>
                <p className="text-xs text-slate-500 font-medium">Active Handouts</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-4 flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{waitlistedBookings.length}</p>
                <p className="text-xs text-slate-500 font-medium">Waitlist In Queue</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-4 flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">48%</p>
                <p className="text-xs text-slate-500 font-medium">Avg Facility Utilization</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Incident Escalation Center */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Incident Escalation Center
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every hardware discrepancy requires human custodian sign-off before closing liability.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Severity:</span>
              {["all", "minor", "moderate", "severe"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={cn(
                    "px-2.5 py-1 rounded-md capitalize font-semibold transition-colors shadow-2xs",
                    filterSeverity === sev
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:text-slate-900 bg-white border border-slate-200"
                  )}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl divide-y divide-slate-100 shadow-xs">
            {incidents
              .filter((i) => (filterSeverity === "all" ? true : i.severity === filterSeverity))
              .map((incident) => {
                const isResolved = incident.status === "resolved";
                return (
                  <div key={incident.id} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 text-xs rounded-full font-semibold capitalize border shadow-2xs",
                            incident.severity === "minor"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : incident.severity === "moderate"
                              ? "bg-orange-50 text-orange-800 border-orange-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                          )}
                        >
                          {incident.severity} Severity
                        </span>
                        <span
                          className={cn(
                            "px-2.5 py-0.5 text-xs rounded-full font-semibold border",
                            isResolved
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          )}
                        >
                          {isResolved ? "Resolved" : "Under Manager Review"}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Ref: {incident.bookingId}
                        </span>
                      </div>
                      <p className="text-sm text-slate-800 leading-relaxed font-medium">{incident.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Reported by: <strong className="text-slate-700">{incident.reportedBy}</strong></span>
                        <span>Time: {formatDateTime(incident.reportedAt)}</span>
                      </div>

                      {isResolved && incident.resolution && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 mt-2">
                          <p className="font-bold text-emerald-700 mb-0.5">Resolution Action:</p>
                          <p>{incident.resolution}</p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Arbitrated by {incident.resolvedBy} on {formatDateTime(incident.resolvedAt || "")}
                          </p>
                        </div>
                      )}
                    </div>

                    {!isResolved && (
                      <div className="flex-shrink-0">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedIncident(incident)}
                        >
                          Review & Arbitrate
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Modal for Arbitration */}
        {selectedIncident && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Arbitrate Incident: {selectedIncident.id}
                </h3>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">Incident Statement:</p>
                <p className="text-slate-600 leading-relaxed">{selectedIncident.description}</p>
              </div>

              <Textarea
                label="Manager Determination & Resolution Record"
                placeholder="Detail reimbursement, replacement parts ordered, or policy exemptions..."
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                rows={3}
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="ghost" size="sm" onClick={() => setSelectedIncident(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!resolutionText.trim()}
                  onClick={() => handleResolveIncident(selectedIncident.id)}
                >
                  Confirm & Seal Resolution
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* FairShare Queue & Anti-Hoarding Monitor */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              FairShare Allocation & Anti-Monopoly Monitor
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent algorithmic rankings. Over-utilised borrowers are deprioritised to prevent hoarding.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-lg text-xs text-slate-700 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-teal-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-slate-900 font-bold">Algorithmic Placement Formula</p>
                <p className="mt-0.5 leading-relaxed text-slate-600">
                  Priority = (Urgency Weight + First-Time Bonus) ÷ (1 + Hours Used This Month ÷ 10) ÷ (1 + Incident Penalties).
                  Every applicant sees the full numerical rationale.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {waitlistedBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{bk.user.name}</span>
                      <span className="text-slate-500">· {bk.user.organization}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold font-mono shadow-2xs">
                        Waitlist #{bk.waitlistPosition || 1}
                      </span>
                    </div>
                    <p className="text-slate-600">
                      Requested: <strong className="text-slate-800">{bk.resource.name}</strong> for: {bk.purpose}
                    </p>
                    <p className="text-slate-500">
                      Prior Usage: {bk.user.hoursUsedThisMonth} hrs this month · Past Incidents: {bk.user.incidentCount}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-medium">FairShare Score</p>
                    <p className="text-lg font-extrabold text-amber-700 font-mono">{bk.fairShareScore.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Facility Bookings Table */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            Facility Reservations Ledger
          </h2>
          <div className="bg-white border border-slate-200/90 rounded-xl overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-600 bg-slate-50/80 font-semibold">
                <tr>
                  <th className="px-4 py-3">Resource</th>
                  <th className="px-4 py-3">Borrower</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">{b.resource.name}</td>
                    <td className="px-4 py-3 font-medium">{b.user.name}</td>
                    <td className="px-4 py-3 text-slate-500 font-medium">{formatDuration(b.startTime, b.endTime)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        <StatusBadge status={b.status} />
                        {b.approvedBy && (
                          <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                            Approved by {b.approvedBy}
                          </span>
                        )}
                        {b.rejectionReason && (
                          <span className="text-[11px] text-rose-800 font-medium bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                            Rejected: {b.rejectionReason}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/bookings/${b.id}`}
                        className="text-teal-700 hover:text-teal-800 font-bold"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
