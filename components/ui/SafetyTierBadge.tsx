"use client";
import { cn } from "@/lib/utils";
import { getSafetyTierLabel, getSafetyTierColor } from "@/lib/utils";
import { Shield } from "lucide-react";

interface SafetyTierBadgeProps {
  tier: 1 | 2 | 3;
  className?: string;
}

export function SafetyTierBadge({ tier, className }: SafetyTierBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md",
        getSafetyTierColor(tier),
        className
      )}
    >
      <Shield className="w-3 h-3" />
      {getSafetyTierLabel(tier)}
    </span>
  );
}
