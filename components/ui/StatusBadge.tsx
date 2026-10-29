"use client";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/lib/types";
import { getStatusLabel, getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md",
        getStatusColor(status),
        className
      )}
    >
      <span
        className={cn(
          "inline-block w-1.5 h-1.5 rounded-full",
          status === "COMPLETED" || status === "APPROVED" || status === "RESOLVED"
            ? "bg-emerald-400"
            : status === "WAITLISTED" || status === "PENDING_APPROVAL" || status === "RETURN_INSPECTION"
            ? "bg-amber-400"
            : status === "REJECTED" || status === "ELIGIBILITY_FAILED" || status === "INCIDENT_FLAGGED"
            ? "bg-rose-400"
            : status === "CHECKED_OUT" || status === "REQUESTED"
            ? "bg-blue-400"
            : "bg-zinc-400"
        )}
      />
      {getStatusLabel(status)}
    </span>
  );
}
