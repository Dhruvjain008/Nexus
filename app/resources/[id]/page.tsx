"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Shield,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileText,
  TrendingUp,
  Building2,
  Tag,
  Info,
  CheckCheck,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { SafetyTierBadge } from "@/components/ui/SafetyTierBadge";
import { ResourceSchematic } from "@/components/resources/ResourceSchematic";
import { USERS } from "@/lib/data";
import { useAuthStore } from "@/lib/store/auth";
import { useBookingsStore } from "@/lib/store/bookings";
import { useResourcesStore } from "@/lib/store/resources";
import {
  cn,
  computeFairShareScore,
  formatRate,
  getSafetyTierLabel,
} from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function randomBookingId(): string {
  return "BK-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function safeOpenPicker(e: React.MouseEvent<HTMLInputElement>) {
  try {
    if (typeof e.currentTarget.showPicker === "function") {
      e.currentTarget.showPicker();
    }
  } catch {
    // Gracefully ignore if browser blocks programmatic picker
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResourceDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? "";
  const { resources } = useResourcesStore();
  const resource = resources.find((r) => r.id === id);

  const { currentUser } = useAuthStore();
  const { addBooking, bookings } = useBookingsStore();

  // Booking form state
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [purpose, setPurpose] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");

  // Duration in minutes
  const durationMinutes = useMemo(() => {
    const s = parseTimeToMinutes(startTime);
    const e = parseTimeToMinutes(endTime);
    return e > s ? e - s : 0;
  }, [startTime, endTime]);

  const durationHours = durationMinutes / 60;

  // Conflict detection
  const hasConflict = useMemo(() => {
    if (!date || !startTime || !endTime || !resource) return false;
    const reqStart = new Date(`${date}T${startTime}:00`).getTime();
    const reqEnd = new Date(`${date}T${endTime}:00`).getTime();

    return bookings.some((b) => {
      if (b.resourceId !== resource.id) return false;
      if (!["APPROVED", "CHECKED_OUT", "PENDING_APPROVAL"].includes(b.status)) return false;
      const bStart = new Date(b.startTime).getTime();
      const bEnd = new Date(b.endTime).getTime();
      return reqStart < bEnd && reqEnd > bStart;
    });
  }, [date, startTime, endTime, resource, bookings]);

  // FairShare score
  const fairShare = useMemo(() => {
    if (!currentUser) return null;
    return computeFairShareScore(currentUser, durationHours <= 24 ? 24 : 72);
  }, [currentUser, durationHours]);

  // Eligibility check
  const eligibilityResults = useMemo(() => {
    if (!resource || !currentUser) return [];
    return resource.eligibilityRules.map((rule) => {
      let met = false;
      if (rule.type === "credential") {
        met = currentUser.credentials.some(
          (c) =>
            c.verified &&
            c.name.toLowerCase().includes(rule.label.toLowerCase().split(" ")[0].toLowerCase())
        );
      } else if (rule.type === "role") {
        met = currentUser.role !== "user" || currentUser.trustScore >= 80;
      } else if (rule.type === "approval") {
        met = false; // approval is always pending — shown as "will be reviewed"
      }
      return { rule, met };
    });
  }, [resource, currentUser]);

  const eligibilityStatus = useMemo(() => {
    if (eligibilityResults.length === 0) return "unknown";
    const required = eligibilityResults.filter((r) => r.rule.required);
    if (required.every((r) => r.met)) return "met";
    if (required.some((r) => r.met)) return "partial";
    return "not_met";
  }, [eligibilityResults]);

  const approvalPolicyLabel = {
    auto: "Auto-approved — booking is confirmed immediately.",
    owner_review: "Owner review required — you will be notified within 24 hours.",
    manager_review: "Manager review required — allow up to 48 hours for a decision.",
  };

  // 404 state
  if (!resource) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] text-slate-800">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 mb-2">
            Resource not found
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            The resource you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm text-teal-700 hover:text-teal-800 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to resources
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-800">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to resources
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Schematic Illustration Banner */}
            <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs">
              <ResourceSchematic category={resource.category} isAvailable={resource.isAvailable} className="h-56" />
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <CategoryBadge category={resource.category} />
              <SafetyTierBadge tier={resource.safetyTier} />
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-full shadow-xs",
                  resource.isAvailable
                    ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                    : "text-slate-600 bg-white border border-slate-200"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    resource.isAvailable ? "bg-emerald-600 animate-pulse" : "bg-slate-400"
                  )}
                />
                {resource.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
              {resource.name}
            </h1>
            {resource.modelNumber && (
              <p className="text-sm text-slate-500 mb-4">{resource.modelNumber}</p>
            )}

            {/* Owner + Location */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{resource.ownerOrgName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{resource.location}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 mb-2">Description</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{resource.description}</p>
            </div>

            {/* Tags */}
            {resource.tags.length > 0 && (
              <div className="flex items-start gap-2 mb-6">
                <Tag className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-1.5">
                  {resource.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-md font-medium shadow-2xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Eligibility Requirements */}
            <div className="mb-6 p-5 bg-white border border-slate-200/90 rounded-xl shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 mb-3">
                Eligibility Requirements
              </h2>
              {resource.eligibilityRules.length === 0 ? (
                <p className="text-sm text-slate-500">No special eligibility requirements.</p>
              ) : (
                <ul className="space-y-3">
                  {eligibilityResults.map(({ rule, met }, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {rule.type === "approval" ? (
                        <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      ) : met ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{rule.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{rule.description}</p>
                        {!currentUser && (
                          <p className="text-xs text-amber-600 font-medium mt-0.5">Sign in to check eligibility</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Usage Conditions */}
            <div className="mb-6 p-5 bg-white border border-slate-200/90 rounded-xl shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 mb-3">Usage Conditions</h2>
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <dt className="text-xs text-slate-500 mb-1 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" /> Max booking
                  </dt>
                  <dd className="text-sm font-bold text-slate-800">
                    {resource.maxBookingHours}h
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 mb-1 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" /> Cooldown
                  </dt>
                  <dd className="text-sm font-bold text-slate-800">
                    {resource.cooldownHours}h
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 mb-1 flex items-center gap-1 font-medium">
                    <Shield className="w-3 h-3" /> Approval
                  </dt>
                  <dd className="text-sm font-bold text-slate-800 capitalize">
                    {resource.approvalPolicy.replace("_", " ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 mb-1 font-medium">Rate</dt>
                  <dd
                    className={cn(
                      "text-sm font-bold",
                      resource.hourlyRate === 0 ? "text-emerald-700" : "text-slate-800"
                    )}
                  >
                    {formatRate(resource.hourlyRate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 mb-1 font-medium">Safety tier</dt>
                  <dd className="text-sm font-bold text-slate-800">
                    Tier {resource.safetyTier} — {getSafetyTierLabel(resource.safetyTier)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Utilization Stats */}
            <div className="p-5 bg-white border border-slate-200/90 rounded-xl shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-700" />
                Utilization
              </h2>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                <span>{resource.totalBookings} total bookings</span>
                <span className="font-bold text-slate-700">{resource.utilizationRate}% utilization</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    resource.utilizationRate >= 70
                      ? "bg-rose-500"
                      : resource.utilizationRate >= 40
                      ? "bg-amber-500"
                      : "bg-teal-600"
                  )}
                  style={{ width: `${resource.utilizationRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Booking Panel ────────────────────────────────── */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="lg:sticky lg:top-6">
              <div className="bg-white border border-slate-200/90 rounded-xl shadow-md overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70">
                  <h2 className="text-sm font-bold text-slate-900">Book this resource</h2>
                </div>

                {!resource.isAvailable ? (
                  /* Unavailable state */
                  <div className="px-5 py-8 text-center">
                    <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-700">Currently unavailable</p>
                    <p className="text-xs text-slate-500 mt-1">
                      This resource is not accepting bookings at this time.
                    </p>
                  </div>
                ) : submitted ? (
                  /* Success state */
                  <div className="px-5 py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCheck className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-900 mb-1">
                      Booking request submitted
                    </p>
                    <p className="text-xs text-slate-500 mb-4">
                      Your booking ID is{" "}
                      <span className="font-mono font-bold text-teal-800">{bookingId}</span>
                    </p>
                    <Link
                      href="/bookings"
                      className="inline-flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-800 font-semibold transition-colors"
                    >
                      View in My Bookings
                    </Link>
                  </div>
                ) : (
                  /* Form */
                  <div className="px-5 py-5 space-y-4">
                    {/* Date */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        <Calendar className="inline w-3.5 h-3.5 mr-1 text-slate-400" />
                        Date (Click to choose)
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        onClick={safeOpenPicker}
                        className={cn(
                          "w-full bg-white border border-slate-300 rounded-lg cursor-pointer shadow-xs",
                          "px-3 py-2 text-sm text-slate-900 [color-scheme:light]",
                          "focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
                        )}
                      />
                    </div>

                    {/* Time row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Start time
                        </label>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          onClick={safeOpenPicker}
                          className={cn(
                            "w-full bg-white border border-slate-300 rounded-lg cursor-pointer shadow-xs",
                            "px-3 py-2 text-sm text-slate-900 [color-scheme:light]",
                            "focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          End time
                        </label>
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          onClick={safeOpenPicker}
                          className={cn(
                            "w-full bg-white border border-slate-300 rounded-lg cursor-pointer shadow-xs",
                            "px-3 py-2 text-sm text-slate-900 [color-scheme:light]",
                            "focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
                          )}
                        />
                      </div>
                    </div>

                    {/* Duration pill */}
                    {durationMinutes > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Duration</span>
                        <span
                          className={cn(
                            "font-bold",
                            durationHours > resource.maxBookingHours
                              ? "text-rose-600"
                              : "text-slate-800"
                          )}
                        >
                          {minutesToHours(durationMinutes)}
                          {durationHours > resource.maxBookingHours && (
                            <span className="ml-1 text-rose-600">
                              (max {resource.maxBookingHours}h)
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Purpose */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        <FileText className="inline w-3.5 h-3.5 mr-1 text-slate-400" />
                        Purpose
                      </label>
                      <textarea
                        rows={3}
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="Briefly describe your intended use..."
                        className={cn(
                          "w-full bg-white border border-slate-300 rounded-lg resize-none shadow-xs",
                          "px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400",
                          "focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
                        )}
                      />
                    </div>

                    {/* Eligibility status */}
                    {currentUser && resource.eligibilityRules.length > 0 && (
                      <div
                        className={cn(
                          "rounded-lg px-3.5 py-2.5 text-xs font-medium border",
                          eligibilityStatus === "met"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : eligibilityStatus === "partial"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-rose-50 text-rose-800 border-rose-200"
                        )}
                      >
                        {eligibilityStatus === "met" && (
                          <span className="flex items-center gap-1.5 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            All eligibility requirements met
                          </span>
                        )}
                        {eligibilityStatus === "partial" && (
                          <span className="flex items-center gap-1.5 font-semibold">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            Some requirements need attention
                          </span>
                        )}
                        {eligibilityStatus === "not_met" && (
                          <span className="flex items-center gap-1.5 font-semibold">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                            Eligibility requirements not met
                          </span>
                        )}
                      </div>
                    )}

                    {/* FairShare preview */}
                    {fairShare && (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-slate-600 font-semibold">FairShare priority score</span>
                          <span className="text-sm font-extrabold text-teal-800">
                            {fairShare.score.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{fairShare.explanation}</p>
                      </div>
                    )}

                    {/* Scheduling conflict alert */}
                    {hasConflict && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-amber-900">Scheduling Conflict Detected</p>
                          <p className="mt-0.5 leading-relaxed text-amber-800">
                            Another researcher has requested or reserved this time slot. Submitting will transparently place you on the FairShare Priority Waiting List.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      onClick={() => {
                        if (date && purpose.trim()) {
                          const newBk = addBooking({
                            resourceId: resource.id,
                            resource: resource,
                            userId: currentUser?.id || "user-1",
                            user: currentUser || USERS[0],
                            startTime: `${date}T${startTime}:00`,
                            endTime: `${date}T${endTime}:00`,
                            purpose: purpose.trim(),
                            status: hasConflict ? "WAITLISTED" : "PENDING_APPROVAL",
                            fairShareScore: fairShare?.score || 1.0,
                            waitlistPosition: hasConflict ? 2 : undefined,
                          });
                          setBookingId(newBk.id);
                          setSubmitted(true);
                        }
                      }}
                      disabled={!date || !purpose.trim() || durationMinutes <= 0}
                      className={cn(
                        "w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all shadow-sm",
                        "bg-[#0f766e] text-white hover:bg-[#115e59]",
                        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0f766e]"
                      )}
                    >
                      Submit Booking Request
                    </button>

                    {/* Policy note */}
                    <p className="text-xs text-slate-500 text-center leading-relaxed">
                      {approvalPolicyLabel[resource.approvalPolicy]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
