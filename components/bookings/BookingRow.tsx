"use client";
import Link from "next/link";
import type { Booking } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { formatDateTime, formatDuration, cn } from "@/lib/utils";
import { MapPin, Clock, ChevronRight, AlertTriangle, CheckCircle2 } from "lucide-react";

interface BookingRowProps {
  booking: Booking;
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  className?: string;
}

export function BookingRow({
  booking,
  showActions = false,
  onApprove,
  onReject,
  className,
}: BookingRowProps) {
  const isOverdue =
    booking.status === "CHECKED_OUT" &&
    new Date(booking.endTime) < new Date();

  return (
    <div
      className={cn(
        "flex items-start gap-4 px-5 py-4 border-b border-slate-100 last:border-b-0",
        "hover:bg-slate-50/80 transition-colors",
        className
      )}
    >
      {/* Category icon */}
      <div className="flex-shrink-0 mt-0.5">
        <CategoryBadge category={booking.resource.category} showIcon className="px-1.5 py-1" />
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <Link
            href={`/resources/${booking.resourceId}`}
            className="text-sm font-bold text-slate-900 hover:text-teal-700 transition-colors truncate"
          >
            {booking.resource.name}
          </Link>
          <StatusBadge status={booking.status} />
          {isOverdue && (
            <span className="inline-flex items-center gap-1 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md font-bold">
              <AlertTriangle className="w-3 h-3" />
              Overdue
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-1 truncate">
          {booking.resource.ownerOrgName} · {booking.resource.location}
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            {formatDateTime(booking.startTime)}
            <span className="text-slate-300">–</span>
            {formatDuration(booking.startTime, booking.endTime)}
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-1.5 line-clamp-1">{booking.purpose}</p>

        {booking.approvedBy && (
          <p className="text-xs text-emerald-800 mt-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600" />
            <span>Approved by <strong className="font-bold text-emerald-900">{booking.approvedBy}</strong> {booking.approvedAt ? `· ${formatDateTime(booking.approvedAt)}` : ""}</span>
          </p>
        )}

        {booking.status === "WAITLISTED" && booking.waitlistPosition && (
          <p className="text-xs text-amber-800 font-semibold mt-1.5">
            Waitlist position #{booking.waitlistPosition} · FairShare score: {booking.fairShareScore.toFixed(2)}
          </p>
        )}

        {booking.rejectionReason && (
          <p className="text-xs text-rose-700 font-semibold mt-1.5">Rejected: {booking.rejectionReason}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {showActions && booking.status === "PENDING_APPROVAL" && (
          <>
            <button
              onClick={() => onApprove?.(booking.id)}
              className="text-xs px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-md transition-colors font-bold shadow-2xs cursor-pointer"
            >
              Approve
            </button>
            <button
              onClick={() => onReject?.(booking.id)}
              className="text-xs px-3 py-1.5 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-md transition-colors font-bold border border-slate-300 hover:border-rose-300 shadow-2xs cursor-pointer"
            >
              Reject
            </button>
          </>
        )}
        <Link
          href={`/bookings/${booking.id}`}
          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
