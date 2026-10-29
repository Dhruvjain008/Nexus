"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuthStore } from "@/lib/store/auth";
import { useBookingsStore } from "@/lib/store/bookings";
import {
  formatDateTime,
  formatDate,
  formatDuration,
  computeFairShareScore,
  cn,
} from "@/lib/utils";
import type { BookingStatus } from "@/lib/types";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  ListOrdered,
  ShieldCheck,
  AlertCircle,
  BadgeCheck,
  Info,
  XCircle,
  Eye,
  RotateCcw,
} from "lucide-react";

type TabKey = "all" | "active" | "pending" | "completed" | "waitlisted";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "waitlisted", label: "Waitlisted" },
];

const STATUS_GROUPS: Record<TabKey, BookingStatus[]> = {
  all: [],
  active: ["APPROVED", "CHECKED_OUT", "RETURN_INSPECTION"],
  pending: ["PENDING_APPROVAL", "REQUESTED", "DRAFT"],
  completed: ["COMPLETED", "RESOLVED", "CANCELLED", "REJECTED"],
  waitlisted: ["WAITLISTED"],
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-5">
        <div className={cn("p-2.5 rounded-lg", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UserDashboardPage() {
  const { currentUser } = useAuthStore();
  const { bookings } = useBookingsStore();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [actionStates, setActionStates] = useState<Record<string, string>>({});

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] text-slate-800">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-10 h-10 text-slate-400" />
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">No role selected</h2>
          <p className="text-sm text-slate-500 max-w-sm">
            Select a demo role from the switcher to explore the user dashboard.
          </p>
        </div>
      </div>
    );
  }

  const userBookings = bookings.filter((b) => b.userId === currentUser.id);

  const stats = {
    active: userBookings.filter((b) =>
      (["APPROVED", "CHECKED_OUT", "RETURN_INSPECTION"] as BookingStatus[]).includes(b.status)
    ).length,
    pending: userBookings.filter((b) =>
      (["PENDING_APPROVAL", "REQUESTED", "DRAFT"] as BookingStatus[]).includes(b.status)
    ).length,
    completed: userBookings.filter((b) => b.status === "COMPLETED").length,
    hoursUsed: currentUser.hoursUsedThisMonth,
  };

  const fairShare = computeFairShareScore(currentUser);

  const filteredBookings =
    activeTab === "all"
      ? userBookings
      : userBookings.filter((b) => STATUS_GROUPS[activeTab].includes(b.status));

  const setAction = (id: string, label: string) =>
    setActionStates((prev) => ({ ...prev, [id]: label }));

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {currentUser.organization}
              {currentUser.department ? ` — ${currentUser.department}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-lg shadow-xs px-4 py-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-slate-700">Trust Score</span>
            <span className="text-sm font-bold text-emerald-700">{currentUser.trustScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Active Bookings"
            value={stats.active}
            icon={CalendarDays}
            color="bg-teal-50 text-teal-700"
          />
          <StatCard
            label="Pending Requests"
            value={stats.pending}
            icon={Clock}
            color="bg-amber-50 text-amber-700"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            icon={CheckCircle2}
            color="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            label="Hours Used This Month"
            value={`${stats.hoursUsed}h`}
            icon={ListOrdered}
            color="bg-slate-100 text-slate-600"
          />
        </div>

        {/* My Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">My Bookings</h2>
              <div className="flex items-center gap-1 flex-wrap">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-semibold rounded-md transition-colors",
                      activeTab === tab.key
                        ? "bg-teal-700 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )}
                  >
                    {tab.label}
                    {tab.key !== "all" && (
                      <span className="ml-1.5 opacity-80">
                        {tab.key === "active"
                          ? stats.active
                          : tab.key === "pending"
                          ? stats.pending
                          : tab.key === "completed"
                          ? stats.completed
                          : userBookings.filter((b) => b.status === "WAITLISTED").length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          {filteredBookings.length === 0 ? (
            <CardContent>
              <div className="py-10 flex flex-col items-center gap-2 text-center">
                <CalendarDays className="w-8 h-8 text-slate-300" />
                <p className="text-sm text-slate-500 font-medium">No bookings in this category.</p>
              </div>
            </CardContent>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">{booking.resource.name}</span>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="text-xs text-slate-500">
                      {formatDateTime(booking.startTime)} &mdash; {formatDateTime(booking.endTime)}{" "}
                      <span className="text-slate-400">
                        ({formatDuration(booking.startTime, booking.endTime)})
                      </span>
                    </p>
                    <p className="text-xs text-slate-600 truncate max-w-md">{booking.purpose}</p>

                    {booking.status === "WAITLISTED" && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          Position #{booking.waitlistPosition}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          FairShare score: {booking.fairShareScore.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-500 italic">
                          {fairShare.explanation}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {actionStates[booking.id] ? (
                      <span className="text-xs text-slate-500 italic">{actionStates[booking.id]}</span>
                    ) : (
                      <>
                        {booking.status === "APPROVED" && (
                          <Link href={`/bookings/${booking.id}`}>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                              Start Handover Check-in
                            </Button>
                          </Link>
                        )}
                        {booking.status === "CHECKED_OUT" && (
                          <Link href={`/bookings/${booking.id}`}>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-medium">
                              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                              Return Inspection & Sign-off
                            </Button>
                          </Link>
                        )}
                        {booking.status === "PENDING_APPROVAL" && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-amber-400/90 font-medium bg-amber-400/10 px-2 py-1 rounded">
                              Awaiting Custodian
                            </span>
                            <Link href={`/bookings/${booking.id}`}>
                              <Button size="sm" variant="ghost">
                                View Request →
                              </Button>
                            </Link>
                          </div>
                        )}
                        {["COMPLETED", "WAITLISTED", "REJECTED", "INCIDENT_FLAGGED"].includes(booking.status) && (
                          <Link href={`/bookings/${booking.id}`}>
                            <Button size="sm" variant="secondary">
                              <Eye className="w-3.5 h-3.5 mr-1.5" />
                              View Audit Record
                            </Button>
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Credentials + FairShare row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Credentials */}
          <Card>
            <CardHeader>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">My Credentials</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentUser.credentials.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <Info className="w-6 h-6 text-slate-300" />
                  <p className="text-sm text-slate-500 font-medium">No credentials on file.</p>
                </div>
              ) : (
                currentUser.credentials.map((cred) => (
                  <div
                    key={cred.id}
                    className="flex items-start justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200/90 rounded-lg shadow-2xs"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      {cred.verified ? (
                        <BadgeCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{cred.name}</p>
                        <p className="text-xs text-slate-500">Issued by {cred.issuedBy}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-slate-400">Expires</p>
                      <p className="text-xs font-semibold text-slate-700">{formatDate(cred.validUntil)}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* FairShare Score */}
          <Card>
            <CardHeader>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">FairShare Score</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-extrabold tracking-tight text-teal-900">
                  {fairShare.score.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full shadow-2xs">
                  {fairShare.explanation}
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-500">Urgency Weight</span>
                  <span className="text-slate-800 font-semibold tabular-nums">{fairShare.breakdown.urgencyWeight.toFixed(1)}x</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-500">First-time Bonus</span>
                  <span className={cn("font-semibold tabular-nums", fairShare.breakdown.firstTimeBonus > 0 ? "text-emerald-700" : "text-slate-400")}>
                    +{fairShare.breakdown.firstTimeBonus.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-500">Hours Used This Month</span>
                  <span className="text-slate-800 font-semibold tabular-nums">{fairShare.breakdown.hoursUsedThisMonth}h</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-500">Incident Penalty</span>
                  <span className={cn("font-semibold tabular-nums", fairShare.breakdown.incidentPenalty > 0 ? "text-rose-600" : "text-slate-400")}>
                    -{fairShare.breakdown.incidentPenalty.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="h-px bg-slate-100" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Higher scores move you up the waitlist when resources are contested. Reduce usage and
                avoid incidents to improve your position.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
