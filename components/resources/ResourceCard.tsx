"use client";
import Link from "next/link";
import type { Resource } from "@/lib/types";
import { cn, formatRate, getSafetyTierColor } from "@/lib/utils";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { ResourceSchematic } from "./ResourceSchematic";
import { MapPin, Shield, ArrowUpRight } from "lucide-react";

interface ResourceCardProps {
  resource: Resource;
  className?: string;
}

export function ResourceCard({ resource, className }: ResourceCardProps) {
  return (
    <Link href={`/resources/${resource.id}`}>
      <div
        className={cn(
          "group bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs cursor-pointer",
          "transition-all duration-200 hover:border-slate-300 hover:shadow-md flex flex-col h-full",
          !resource.isAvailable && "opacity-60",
          className
        )}
      >
        {/* ── Top Area: Animated Blueprint Schematic Vector (Matching Screenshot 2) ── */}
        <div className="relative">
          <ResourceSchematic category={resource.category} isAvailable={resource.isAvailable} />

          {/* Top Left: Category Badge */}
          <div className="absolute top-3 left-3 z-10">
            <CategoryBadge
              category={resource.category}
              showIcon
              className="bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-2xs font-bold"
            />
          </div>

          {/* Top Right: Availability Pill */}
          <div className="absolute top-3 right-3 z-10">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold rounded-full shadow-2xs backdrop-blur-xs",
                resource.isAvailable
                  ? "text-emerald-800 bg-white/95 border border-emerald-200"
                  : "text-slate-600 bg-white/95 border border-slate-200"
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

          {/* Utilization progress indicator bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200/70 z-10">
            <div
              className={cn(
                "h-full transition-all",
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

        {/* ── Card Body (Matching Screenshot 2) ── */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Top meta row: Owner org + Safety Tier badge */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase truncate">
              {resource.ownerOrgName}
            </p>
            <span
              className={cn(
                "text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border shadow-2xs flex-shrink-0",
                getSafetyTierColor(resource.safetyTier)
              )}
            >
              <Shield className="w-3 h-3" />
              Tier {resource.safetyTier}
            </span>
          </div>

          {/* Resource Title */}
          <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors line-clamp-1">
            {resource.name}
          </h3>

          {/* Model Number */}
          {resource.modelNumber && (
            <p className="text-xs text-slate-400 font-medium mt-0.5">{resource.modelNumber}</p>
          )}

          {/* Description */}
          <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-2">
            {resource.description}
          </p>

          {/* Bottom Meta Row: Location + Rate + Arrow */}
          <div className="flex items-center justify-between gap-2 mt-auto pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{resource.building || resource.location}</span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={cn(
                  "text-xs font-bold px-2.5 py-1 rounded-md border shadow-2xs",
                  resource.hourlyRate === 0
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-slate-50 border-slate-200 text-slate-800"
                )}
              >
                {formatRate(resource.hourlyRate)}
              </span>
              <span className="w-6 h-6 rounded-md bg-teal-50 border border-teal-200/80 text-teal-700 flex items-center justify-center text-xs group-hover:bg-teal-700 group-hover:text-white transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
