import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import type { BookingStatus, ResourceCategory, FairShareScore, User } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return format(new Date(dateString), "dd MMM yyyy");
}

export function formatDateTime(dateString: string): string {
  return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
}

export function formatTimeAgo(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

export function formatDuration(startTime: string, endTime: string): string {
  const diff = new Date(endTime).getTime() - new Date(startTime).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function getStatusLabel(status: BookingStatus): string {
  const labels: Record<BookingStatus, string> = {
    DRAFT: "Draft",
    REQUESTED: "Requested",
    ELIGIBILITY_FAILED: "Eligibility Failed",
    WAITLISTED: "Waitlisted",
    PENDING_APPROVAL: "Pending Approval",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    CHECKED_OUT: "Checked Out",
    RETURN_INSPECTION: "Return Inspection",
    COMPLETED: "Completed",
    INCIDENT_FLAGGED: "Incident Flagged",
    RESOLVED: "Resolved",
    CANCELLED: "Cancelled",
  };
  return labels[status] || status;
}

export function getStatusColor(status: BookingStatus): string {
  const colors: Record<BookingStatus, string> = {
    DRAFT: "text-slate-600 bg-slate-100 border border-slate-200",
    REQUESTED: "text-teal-700 bg-teal-50 border border-teal-200",
    ELIGIBILITY_FAILED: "text-rose-700 bg-rose-50 border border-rose-200",
    WAITLISTED: "text-amber-700 bg-amber-50 border border-amber-200",
    PENDING_APPROVAL: "text-amber-700 bg-amber-50 border border-amber-200",
    APPROVED: "text-emerald-700 bg-emerald-50 border border-emerald-200",
    REJECTED: "text-rose-700 bg-rose-50 border border-rose-200",
    CHECKED_OUT: "text-blue-700 bg-blue-50 border border-blue-200",
    RETURN_INSPECTION: "text-amber-700 bg-amber-50 border border-amber-200",
    COMPLETED: "text-emerald-700 bg-emerald-50 border border-emerald-200",
    INCIDENT_FLAGGED: "text-rose-700 bg-rose-50 border border-rose-200",
    RESOLVED: "text-emerald-700 bg-emerald-50 border border-emerald-200",
    CANCELLED: "text-slate-600 bg-slate-100 border border-slate-200",
  };
  return colors[status] || "text-slate-600 bg-slate-100 border border-slate-200";
}

export function getCategoryLabel(category: ResourceCategory): string {
  const labels: Record<ResourceCategory, string> = {
    laboratory: "Laboratory",
    computing: "Computing",
    imaging: "Imaging",
    fabrication: "Fabrication",
    audio_visual: "Audio / Visual",
    workshop: "Workshop",
    space: "Space",
    testing: "Testing Equipment",
  };
  return labels[category] || category;
}

export function getSafetyTierLabel(tier: 1 | 2 | 3): string {
  return {
    1: "Open Access",
    2: "Trained Personnel Only",
    3: "Supervised Use Required",
  }[tier];
}

export function getSafetyTierColor(tier: 1 | 2 | 3): string {
  return {
    1: "text-emerald-700 bg-emerald-50 border border-emerald-200",
    2: "text-amber-700 bg-amber-50 border border-amber-200",
    3: "text-rose-700 bg-rose-50 border border-rose-200",
  }[tier];
}

export function computeFairShareScore(user: User, urgencyHours: number = 24): FairShareScore {
  const urgencyWeight = urgencyHours <= 24 ? 1.5 : urgencyHours <= 72 ? 1.0 : 0.5;
  const firstTimeBonus = user.hoursUsedThisMonth === 0 ? 2.0 : 0;
  const incidentPenalty = user.incidentCount * 0.5;
  const score =
    (urgencyWeight + firstTimeBonus) / (1 + user.hoursUsedThisMonth / 10) / (1 + incidentPenalty);

  const explanationParts: string[] = [];
  if (firstTimeBonus > 0) explanationParts.push("First request this period");
  if (urgencyWeight > 1) explanationParts.push("Urgent timeline");
  if (user.hoursUsedThisMonth > 0)
    explanationParts.push(`${user.hoursUsedThisMonth}h used this month`);
  if (incidentPenalty > 0) explanationParts.push(`${user.incidentCount} past incident(s)`);

  return {
    userId: user.id,
    score: Math.round(score * 100) / 100,
    breakdown: {
      urgencyWeight,
      firstTimeBonus,
      hoursUsedThisMonth: user.hoursUsedThisMonth,
      incidentPenalty,
    },
    rank: 0, // set externally when ranking multiple users
    explanation: explanationParts.join(" · ") || "Standard priority",
  };
}

export function formatCredits(credits: number): string {
  return `${credits} credits`;
}

export function formatRate(rate: number): string {
  if (rate === 0) return "Free";
  return `₹${rate}/hr`;
}
