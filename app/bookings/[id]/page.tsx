"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useBookingsStore } from "@/lib/store/bookings";
import { ConditionReportForm } from "@/components/bookings/ConditionReportForm";
import type { IncidentSeverity } from "@/lib/types";
import { formatDateTime, formatDuration, formatDate, cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AuditLedger } from "@/components/bookings/AuditLedger";
import type { ConditionReport } from "@/lib/types";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ClipboardList,
  ShieldAlert,
  BadgeCheck,
  CircleDot,
  Star,
  AlertTriangle,
  Hourglass,
  PackageCheck,
  PackageSearch,
  RotateCcw,
  ChevronRight,
  User,
  Calendar,
  AlarmClock,
  FileText,
  ShieldCheck,
} from "lucide-react";

const LIFECYCLE_STAGES = [
  { key: "REQUESTED", label: "Requested", Icon: ClipboardList },
  { key: "ELIGIBILITY_CHECK", label: "Eligibility Check", Icon: BadgeCheck },
  { key: "PENDING_APPROVAL", label: "Pending Approval", Icon: Hourglass },
  { key: "APPROVED", label: "Approved", Icon: CheckCircle2 },
  { key: "CHECKED_OUT", label: "Checked Out", Icon: PackageCheck },
  { key: "RETURN_INSPECTION", label: "Return Inspection", Icon: PackageSearch },
  { key: "COMPLETED", label: "Completed", Icon: RotateCcw },
] as const;

const STATUS_ORDER = [
  "REQUESTED",
  "ELIGIBILITY_CHECK",
  "PENDING_APPROVAL",
  "APPROVED",
  "CHECKED_OUT",
  "RETURN_INSPECTION",
  "COMPLETED",
];

function getStageState(
  stageKey: string,
  currentStatus: string
): "completed" | "current" | "pending" {
  const stageIdx = STATUS_ORDER.indexOf(stageKey);
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);

  if (currentIdx === -1) return "pending";
  if (stageIdx < currentIdx) return "completed";
  if (stageIdx === currentIdx) return "current";
  return "pending";
}

function ConditionReportSection({ report, label }: { report: ConditionReport; label: string }) {
  return (
    <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-xs">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
        <h3 className="text-sm font-bold text-slate-900">{label}</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Recorded {formatDateTime(report.recordedAt)}
        </p>
      </div>
      <div className="px-4 py-4 space-y-3">
        <div className="space-y-2">
          {report.checklist.map((item) => (
            <div key={item.id} className="flex items-start gap-2.5">
              {item.checkedOk ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              )}
              <span className={cn("text-sm font-medium", item.checkedOk ? "text-slate-800" : "text-rose-800")}>
                {item.label}
              </span>
              {item.note && (
                <span className="text-xs text-slate-400 italic">{item.note}</span>
              )}
            </div>
          ))}
        </div>

        {report.aiAnalysisNotes && (
          <div className="flex items-start gap-2.5 bg-teal-50 border border-teal-200 rounded-lg px-3.5 py-2.5 mt-2">
            <ShieldCheck className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-teal-900 mb-0.5">AI Telemetry Analysis</p>
              <p className="text-xs text-teal-800 leading-relaxed">{report.aiAnalysisNotes}</p>
            </div>
          </div>
        )}

        {report.aiDiscrepancyFlag && (
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900">Discrepancy Detected</p>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                AI has flagged a potential discrepancy between check-in and return condition. Pending owner review.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                report.signedByUser ? "bg-emerald-600" : "bg-slate-300"
              )}
            />
            <span className="text-xs text-slate-600 font-medium">Borrower signed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                report.signedByOwner ? "bg-emerald-600" : "bg-slate-300"
              )}
            />
            <span className="text-xs text-slate-600 font-medium">Custodian counter-signed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const { bookings, auditEvents: allAuditEvents, incidents, recordConditionReport, reportIncident } = useBookingsStore();

  const [isIncidentOpen, setIsIncidentOpen] = useState(false);
  const [incSeverity, setIncSeverity] = useState<IncidentSeverity>("minor");
  const [incDesc, setIncDesc] = useState("");

  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] text-slate-800">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-100 mb-4">
            <FileText className="w-5 h-5 text-slate-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Booking not found</h1>
          <p className="text-slate-500 text-sm mb-6">
            No booking with ID <code className="text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded text-xs font-mono font-bold">{bookingId}</code> exists.
          </p>
          <Link
            href="/dashboard/user"
            className="inline-flex items-center gap-2 text-sm text-teal-700 hover:text-teal-800 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to my bookings
          </Link>
        </div>
      </div>
    );
  }

  const auditEvents = allAuditEvents.filter((e) => e.bookingId === bookingId);
  const incident = incidents.find((inc) => inc.bookingId === bookingId);
  const currentStatus = booking.status;
  const isTerminal = ["WAITLISTED", "REJECTED", "INCIDENT_FLAGGED", "CANCELLED", "ELIGIBILITY_FAILED"].includes(currentStatus);

  const timelineStatus = isTerminal ? currentStatus : currentStatus;
  const showReportIncident = currentStatus === "CHECKED_OUT" || currentStatus === "RETURN_INSPECTION";

  const durationStr = formatDuration(booking.startTime, booking.endTime);

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Page header */}
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-xl font-extrabold text-slate-900">
                Booking {booking.id}
              </h1>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-sm text-slate-500 font-medium">{booking.resource.name}</p>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mb-6">
          {/* LEFT: Timeline */}
          <div className="space-y-5">
            {/* Lifecycle timeline */}
            <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70">
                <h2 className="text-sm font-bold text-slate-900">Booking Lifecycle</h2>
              </div>
              <div className="px-5 py-5">
                {isTerminal && !["COMPLETED"].includes(currentStatus) ? (
                  /* Condensed terminal state view */
                  <div className="space-y-3">
                    {/* Show completed stages up to point of diversion */}
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-slate-600 font-medium">Requested</span>
                    </div>

                    {currentStatus === "WAITLISTED" && (
                      <>
                        <div className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-slate-600 font-medium">Eligibility Check</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                          <Star className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-800">Waitlisted</span>
                            <span className="text-slate-500 ml-2 text-xs font-semibold">
                              Position #{booking.waitlistPosition}
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {currentStatus === "ELIGIBILITY_FAILED" && (
                      <div className="flex items-start gap-3 text-sm">
                        <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        <span className="font-bold text-rose-800">Eligibility Failed</span>
                      </div>
                    )}

                    {currentStatus === "REJECTED" && (
                      <>
                        <div className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-slate-600 font-medium">Eligibility Check</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-slate-600 font-medium">Pending Approval</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                          <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                          <span className="font-bold text-rose-800">Rejected</span>
                        </div>
                      </>
                    )}

                    {currentStatus === "INCIDENT_FLAGGED" && (
                      <>
                        <div className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-slate-600 font-medium">Eligibility Check</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-slate-600 font-medium">Pending Approval</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-slate-600 font-medium">Approved</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-slate-600 font-medium">Checked Out</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                          <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                          <span className="font-bold text-rose-800">Incident Flagged</span>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  /* Standard linear timeline */
                  <div className="relative">
                    <div className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-200" />
                    <div className="space-y-0">
                      {LIFECYCLE_STAGES.map((stage) => {
                        const state = getStageState(stage.key, currentStatus);
                        return (
                          <div key={stage.key} className="relative flex items-start gap-3 pb-5 last:pb-0">
                            <div
                              className={cn(
                                "relative z-10 flex items-center justify-center w-8 h-8 rounded-lg border flex-shrink-0 shadow-2xs",
                                state === "completed"
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                                  : state === "current"
                                  ? "bg-teal-50 border-teal-600 text-teal-700 ring-2 ring-teal-600/20"
                                  : "bg-slate-50 border-slate-200 text-slate-400"
                              )}
                            >
                              {state === "completed" ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : state === "current" ? (
                                <CircleDot className="w-4 h-4 text-teal-700" />
                              ) : (
                                <stage.Icon className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div className="pt-1.5">
                              <p
                                className={cn(
                                  "text-sm font-semibold",
                                  state === "completed"
                                    ? "text-slate-700"
                                    : state === "current"
                                    ? "text-slate-900 font-bold"
                                    : "text-slate-400 font-medium"
                                )}
                              >
                                {stage.label}
                              </p>
                              {state === "current" && (
                                <p className="text-xs text-teal-700 font-semibold mt-0.5">Current stage</p>
                              )}
                              {state === "completed" && (
                                <p className="text-xs text-slate-400 mt-0.5">Done</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* WAITLISTED card */}
            {booking.status === "WAITLISTED" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Hourglass className="w-4 h-4 text-amber-700" />
                  <h3 className="text-sm font-bold text-amber-900">
                    Waitlist Position #{booking.waitlistPosition}
                  </h3>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  This slot is fully booked. You have been placed on the waitlist based on your FairShare score. You will be automatically promoted if a slot opens.
                </p>
                <div className="bg-white border border-amber-200 rounded-lg px-3.5 py-3 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-slate-600">FairShare Priority Score</p>
                    <p className="text-lg font-extrabold text-teal-900 tabular-nums">
                      {booking.fairShareScore.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Your score reflects request urgency, first-time use bonuses, hours consumed this month, and any past incident penalties. Higher scores move up the queue.
                  </p>
                </div>
              </div>
            )}

            {/* REJECTED reason */}
            {booking.status === "REJECTED" && booking.rejectionReason && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <h3 className="text-sm font-bold text-rose-900">Booking Rejected</h3>
                </div>
                <p className="text-sm text-rose-800">{booking.rejectionReason}</p>
              </div>
            )}

            {/* INCIDENT_FLAGGED details */}
            {booking.status === "INCIDENT_FLAGGED" && incident && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <h3 className="text-sm font-bold text-amber-900">Incident Flagged</h3>
                  <span className="text-xs font-semibold text-amber-800 capitalize ml-auto bg-amber-100/60 px-2 py-0.5 rounded border border-amber-200">{incident.severity} severity</span>
                </div>
                <p className="text-sm text-amber-800">{incident.description}</p>
                <p className="text-xs text-slate-500">
                  Reported by {incident.reportedBy} on {formatDate(incident.reportedAt)}
                </p>
                {incident.status === "resolved" && incident.resolution && (
                  <div className="mt-2 pt-2 border-t border-amber-200">
                    <p className="text-xs font-bold text-slate-700 mb-1">Resolution</p>
                    <p className="text-xs text-slate-600">{incident.resolution}</p>
                  </div>
                )}
              </div>
            )}

            {/* Live Interactive Pre-Use Handover Inspection */}
            {booking.status === "APPROVED" && (
              <div className="space-y-3">
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
                  <h3 className="text-sm font-bold text-teal-900 flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-teal-700" />
                    Step 7: Pre-Use Handover Inspection
                  </h3>
                  <p className="text-xs text-teal-800 mt-1 leading-relaxed">
                    Both borrower and verified equipment custodian must inspect the physical baseline condition and digitally sign before hardware is released.
                  </p>
                </div>
                <ConditionReportForm
                  phase="CHECK_IN"
                  bookingId={booking.id}
                  onComplete={() => {
                    recordConditionReport(booking.id, {
                      id: `cr-${Date.now().toString().slice(-4)}`,
                      bookingId: booking.id,
                      phase: "CHECK_IN",
                      checklist: [
                        { id: "c1", label: "Clean and free of visible contamination", checkedOk: true },
                        { id: "c2", label: "All safety enclosures and cables attached", checkedOk: true },
                        { id: "c3", label: "No baseline structural cracks or defects", checkedOk: true },
                        { id: "c4", label: "Emergency power shut-off functional", checkedOk: true },
                      ],
                      photoUrls: [],
                      aiAnalysisNotes: "Visual telemetry verified: Optical column aligned. Zero baseline defects.",
                      aiDiscrepancyFlag: false,
                      signedByUser: true,
                      signedByOwner: true,
                      recordedAt: new Date().toISOString(),
                      recordedBy: booking.user.name,
                    });
                  }}
                />
              </div>
            )}

            {/* Live Interactive Post-Use Return Verification */}
            {booking.status === "CHECKED_OUT" && (
              <div className="space-y-3">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                    <PackageSearch className="w-4 h-4 text-emerald-700" />
                    Step 8: Post-Use Return Verification
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    Inspect equipment upon session completion. Sign off to seal custody transfer.
                  </p>
                </div>
                <ConditionReportForm
                  phase="RETURN"
                  bookingId={booking.id}
                  onComplete={() => {
                    recordConditionReport(booking.id, {
                      id: `cr-${Date.now().toString().slice(-4)}`,
                      bookingId: booking.id,
                      phase: "RETURN",
                      checklist: [
                        { id: "r1", label: "Equipment returned wiped down and sanitised", checkedOk: true },
                        { id: "r2", label: "All accessories docked in proper compartments", checkedOk: true },
                        { id: "r3", label: "No runtime surface fractures or burned coils", checkedOk: true },
                        { id: "r4", label: "Operating hours logged in lab book", checkedOk: true },
                      ],
                      photoUrls: [],
                      aiAnalysisNotes: "Post-use condition matches baseline. No delta discrepancies found.",
                      aiDiscrepancyFlag: false,
                      signedByUser: true,
                      signedByOwner: true,
                      recordedAt: new Date().toISOString(),
                      recordedBy: booking.user.name,
                    });
                  }}
                />
              </div>
            )}
          </div>

          {/* RIGHT: Details panel (sticky) */}
          <div className="lg:sticky lg:top-20 h-fit space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70">
                <h2 className="text-sm font-bold text-slate-900">Booking Details</h2>
              </div>
              <div className="px-5 py-4 space-y-4">
                {/* Resource */}
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-1">Resource</p>
                  <Link
                    href={`/resources/${booking.resourceId}`}
                    className="text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors flex items-center gap-1"
                  >
                    {booking.resource.name}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">{booking.resource.location}</p>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Time range */}
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Schedule
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatDateTime(booking.startTime)}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    to {formatDateTime(booking.endTime)}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlarmClock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-600 font-medium">Duration: {durationStr}</span>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Purpose */}
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-1">Purpose</p>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{booking.purpose}</p>
                </div>

                <div className="h-px bg-slate-100" />

                {/* User info */}
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Requester
                  </p>
                  <p className="text-sm font-bold text-slate-900">{booking.user.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{booking.user.organization}</p>
                  {booking.user.department && (
                    <p className="text-xs text-slate-400">{booking.user.department}</p>
                  )}
                  <div className="flex items-center gap-1.5 mt-2">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs text-slate-600 font-medium">
                      Trust score:{" "}
                      <span className="font-bold text-slate-800">{booking.user.trustScore}</span>
                      <span className="text-slate-400">/100</span>
                    </span>
                  </div>
                </div>

                {/* Approval info */}
                {booking.approvedBy && (
                  <>
                    <div className="h-px bg-slate-100" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium mb-1">Approval</p>
                      <p className="text-sm font-bold text-slate-800">{booking.approvedBy}</p>
                      {booking.approvedAt && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatDateTime(booking.approvedAt)}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* FairShare score */}
            <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-3 shadow-xs">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 font-semibold">FairShare Priority Score</p>
                <p className="text-sm font-extrabold tabular-nums text-teal-900 font-mono">
                  {booking.fairShareScore.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Condition Reports */}
        {(booking.checkInReport || booking.returnReport) && (
          <div className="space-y-4 mb-6">
            <h2 className="text-sm font-bold text-slate-900">Condition Reports</h2>
            {booking.checkInReport && (
              <ConditionReportSection
                report={booking.checkInReport}
                label="Pre-Use Condition Report"
              />
            )}
            {booking.returnReport && (
              <ConditionReportSection
                report={booking.returnReport}
                label="Post-Use Condition Report"
              />
            )}
          </div>
        )}

        {/* Audit Ledger */}
        <div className="mb-6 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Audit Ledger</h2>
          <AuditLedger events={auditEvents} />
        </div>

        {/* Report Incident button */}
        {showReportIncident && (
          <div className="flex items-center justify-end pb-6">
            <button
              onClick={() => setIsIncidentOpen(true)}
              className="inline-flex items-center gap-2 text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              Report an Incident
            </button>
          </div>
        )}

        {/* Incident Escalation Modal */}
        {isIncidentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
            <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-rose-700 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Flag Hardware Discrepancy / Incident
                </h3>
                <button
                  onClick={() => setIsIncidentOpen(false)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Severity Rating</label>
                  <select
                    value={incSeverity}
                    onChange={(e) => setIncSeverity(e.target.value as IncidentSeverity)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 capitalize focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs font-medium"
                  >
                    <option value="minor">Minor (Cosmetic scratch / loose knob)</option>
                    <option value="moderate">Moderate (Component wear / delayed return)</option>
                    <option value="severe">Severe (Hardware malfunction / broken component)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Incident Statement & Findings *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe exactly what defect or operational anomaly occurred during runtime..."
                    value={incDesc}
                    onChange={(e) => setIncDesc(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsIncidentOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!incDesc.trim()}
                  onClick={() => {
                    reportIncident(booking.id, booking.user.name, incSeverity, incDesc.trim());
                    setIsIncidentOpen(false);
                    setIncDesc("");
                  }}
                  className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  Submit Incident to Risk Manager
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
