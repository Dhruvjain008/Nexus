"use client";
import { cn } from "@/lib/utils";
import type { ResourceCategory } from "@/lib/types";
import { getCategoryLabel } from "@/lib/utils";
import {
  FlaskConical,
  Monitor,
  Camera,
  Layers,
  Volume2,
  Hammer,
  DoorOpen,
  Cpu,
} from "lucide-react";

const CATEGORY_ICONS: Record<ResourceCategory, React.ElementType> = {
  laboratory: FlaskConical,
  computing: Cpu,
  imaging: Camera,
  fabrication: Layers,
  audio_visual: Volume2,
  workshop: Hammer,
  space: DoorOpen,
  testing: Monitor,
};

const CATEGORY_COLORS: Record<ResourceCategory, string> = {
  laboratory: "text-blue-700 bg-blue-50 border border-blue-200/80",
  computing: "text-purple-700 bg-purple-50 border border-purple-200/80",
  imaging: "text-amber-700 bg-amber-50 border border-amber-200/80",
  fabrication: "text-emerald-700 bg-emerald-50 border border-emerald-200/80",
  audio_visual: "text-pink-700 bg-pink-50 border border-pink-200/80",
  workshop: "text-orange-700 bg-orange-50 border border-orange-200/80",
  space: "text-teal-700 bg-teal-50 border border-teal-200/80",
  testing: "text-indigo-700 bg-indigo-50 border border-indigo-200/80",
};

interface CategoryBadgeProps {
  category: ResourceCategory;
  showIcon?: boolean;
  className?: string;
}

export function CategoryBadge({ category, showIcon = true, className }: CategoryBadgeProps) {
  const Icon = CATEGORY_ICONS[category];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md",
        CATEGORY_COLORS[category],
        className
      )}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {getCategoryLabel(category)}
    </span>
  );
}
