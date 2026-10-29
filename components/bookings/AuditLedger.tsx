"use client";
import { cn } from "@/lib/utils";
import type { AuditEvent } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { Shield, User, Settings, Lock } from "lucide-react";

interface AuditLedgerProps {
  events: AuditEvent[];
}

const roleIcon = (role: string) => {
  switch (role) {
    case "admin":
      return <Settings className="w-3.5 h-3.5 text-rose-600" />;
    case "manager":
      return <Shield className="w-3.5 h-3.5 text-amber-600" />;
    case "owner":
      return <Lock className="w-3.5 h-3.5 text-teal-700" />;
    default:
      return <User className="w-3.5 h-3.5 text-slate-500" />;
  }
};

export function AuditLedger({ events }: AuditLedgerProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-slate-500 py-4 font-medium">No audit events recorded.</p>
    );
  }

  return (
    <div className="space-y-0 border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-xs">
      {events.map((event, i) => (
        <div
          key={event.id}
          className={cn(
            "flex items-start gap-3 px-4 py-3.5 text-sm hover:bg-slate-50/50 transition-colors",
            i !== events.length - 1 && "border-b border-slate-100"
          )}
        >
          <div className="mt-0.5 flex items-center gap-1.5 flex-shrink-0">
            {roleIcon(event.performedByRole)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-bold text-slate-900">{event.action}</span>
              <span className="text-xs text-slate-400 font-medium tabular-nums flex-shrink-0">
                {formatDateTime(event.timestamp)}
              </span>
            </div>
            <p className="text-slate-600 text-xs mt-0.5 font-medium">
              {event.performedBy}{" "}
              <span className="capitalize text-slate-400">
                ({event.performedByRole})
              </span>
            </p>
            {Object.keys(event.details).length > 0 && (
              <p className="mt-1 text-xs text-slate-600 font-mono bg-slate-50 p-2 rounded-md border border-slate-200/80 break-all">
                {JSON.stringify(event.details)}
              </p>
            )}
            {event.prevHash && (
              <p className="mt-1 text-[10px] text-slate-400 font-mono truncate">
                prev: {event.prevHash}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
