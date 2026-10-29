"use client";
import { cn } from "@/lib/utils";
import type { FairShareScore } from "@/lib/types";
import { Info } from "lucide-react";

interface FairShareCardProps {
  score: FairShareScore;
  showBreakdown?: boolean;
  className?: string;
}

export function FairShareCard({ score, showBreakdown = true, className }: FairShareCardProps) {
  const scoreColor =
    score.score >= 1.5
      ? "text-emerald-400"
      : score.score >= 0.8
      ? "text-amber-400"
      : "text-rose-400";

  const scoreBg =
    score.score >= 1.5
      ? "bg-emerald-400/10 border-emerald-400/20"
      : score.score >= 0.8
      ? "bg-amber-400/10 border-amber-400/20"
      : "bg-rose-400/10 border-rose-400/20";

  return (
    <div className={cn("bg-zinc-900 border border-zinc-800 rounded-lg p-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            FairShare Priority Score
          </p>
          <div className="flex items-baseline gap-2">
            <span className={cn("text-3xl font-bold tabular-nums", scoreColor)}>
              {score.score.toFixed(2)}
            </span>
            {score.rank > 0 && (
              <span className="text-sm text-zinc-500">
                #{score.rank} in queue
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-1">{score.explanation}</p>
        </div>
        <div className={cn("px-3 py-2 rounded-md border text-center min-w-[72px]", scoreBg)}>
          <p className={cn("text-xl font-bold", scoreColor)}>{score.score.toFixed(1)}</p>
          <p className="text-xs text-zinc-500 mt-0.5">score</p>
        </div>
      </div>

      {showBreakdown && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <p className="text-xs font-medium text-zinc-400 mb-3">Score Breakdown</p>
          <div className="space-y-2">
            <ScoreRow
              label="Urgency weight"
              value={score.breakdown.urgencyWeight}
              hint="Based on time until requested slot"
              positive
            />
            <ScoreRow
              label="First-time bonus"
              value={score.breakdown.firstTimeBonus}
              hint="No prior bookings this period"
              positive
            />
            <ScoreRow
              label="Hours used this month"
              value={score.breakdown.hoursUsedThisMonth}
              hint="Higher usage reduces priority"
              positive={false}
            />
            <ScoreRow
              label="Incident penalty"
              value={score.breakdown.incidentPenalty}
              hint="Per unresolved incident"
              positive={false}
            />
          </div>
          <div className="mt-3 flex items-start gap-2 p-2.5 bg-zinc-800/50 rounded-md">
            <Info className="w-3.5 h-3.5 text-zinc-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-zinc-500 leading-relaxed">
              Formula:{" "}
              <code className="text-zinc-300 font-mono text-xs">
                (urgency + first_time) / (1 + hours/10) / (1 + penalties)
              </code>
              . Owners may override for institutional priorities.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreRow({
  label,
  value,
  hint,
  positive,
}: {
  label: string;
  value: number;
  hint: string;
  positive: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-300">{label}</p>
        <p className="text-xs text-zinc-600">{hint}</p>
      </div>
      <span
        className={cn(
          "text-xs font-mono font-medium tabular-nums",
          value === 0
            ? "text-zinc-600"
            : positive
            ? "text-emerald-400"
            : "text-rose-400"
        )}
      >
        {positive ? "+" : value === 0 ? "" : "-"}
        {value}
      </span>
    </div>
  );
}
