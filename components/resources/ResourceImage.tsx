"use client";
import { cn } from "@/lib/utils";
import type { ResourceCategory } from "@/lib/types";

// SVG-based resource image placeholders — no AI slop images
const CATEGORY_PATTERNS: Record<ResourceCategory, { bg: string; pattern: React.ReactNode }> = {
  testing: {
    bg: "bg-indigo-950/40",
    pattern: (
      <svg viewBox="0 0 120 80" className="w-full h-full opacity-30">
        <line x1="20" y1="60" x2="20" y2="20" stroke="#6366f1" strokeWidth="2" />
        <line x1="40" y1="60" x2="40" y2="30" stroke="#6366f1" strokeWidth="2" />
        <line x1="60" y1="60" x2="60" y2="15" stroke="#6366f1" strokeWidth="2" />
        <line x1="80" y1="60" x2="80" y2="35" stroke="#6366f1" strokeWidth="2" />
        <line x1="100" y1="60" x2="100" y2="25" stroke="#6366f1" strokeWidth="2" />
        <line x1="10" y1="60" x2="110" y2="60" stroke="#6366f1" strokeWidth="1" opacity="0.5" />
        <polyline points="20,20 40,30 60,15 80,35 100,25" stroke="#818cf8" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
  fabrication: {
    bg: "bg-emerald-950/40",
    pattern: (
      <svg viewBox="0 0 120 80" className="w-full h-full opacity-30">
        <rect x="25" y="15" width="70" height="50" rx="2" stroke="#10b981" strokeWidth="1.5" fill="none" />
        <rect x="35" y="25" width="50" height="30" rx="1" stroke="#10b981" strokeWidth="1" fill="none" strokeDasharray="3 2" />
        <line x1="60" y1="5" x2="60" y2="15" stroke="#10b981" strokeWidth="2" />
        <line x1="60" y1="65" x2="60" y2="75" stroke="#10b981" strokeWidth="2" />
        <circle cx="60" cy="40" r="8" stroke="#34d399" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
  computing: {
    bg: "bg-violet-950/40",
    pattern: (
      <svg viewBox="0 0 120 80" className="w-full h-full opacity-30">
        <rect x="15" y="15" width="90" height="55" rx="3" stroke="#8b5cf6" strokeWidth="1.5" fill="none" />
        {[0,1,2,3].map(i => (
          <rect key={i} x={22 + i*22} y="22" width="14" height="10" rx="1" stroke="#a78bfa" strokeWidth="1" fill="#a78bfa" fillOpacity="0.2" />
        ))}
        <line x1="22" y1="42" x2="98" y2="42" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 2" />
        <line x1="22" y1="52" x2="78" y2="52" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 2" />
        <line x1="22" y1="62" x2="58" y2="62" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 2" />
      </svg>
    ),
  },
  imaging: {
    bg: "bg-orange-950/40",
    pattern: (
      <svg viewBox="0 0 120 80" className="w-full h-full opacity-30">
        <rect x="20" y="25" width="65" height="40" rx="3" stroke="#f97316" strokeWidth="1.5" fill="none" />
        <circle cx="52" cy="45" r="12" stroke="#fb923c" strokeWidth="1.5" fill="none" />
        <circle cx="52" cy="45" r="6" stroke="#fb923c" strokeWidth="1" fill="none" />
        <rect x="82" y="30" width="15" height="8" rx="1" stroke="#f97316" strokeWidth="1" fill="none" />
        <line x1="88" y1="38" x2="88" y2="55" stroke="#f97316" strokeWidth="1.5" />
      </svg>
    ),
  },
  laboratory: {
    bg: "bg-blue-950/40",
    pattern: (
      <svg viewBox="0 0 120 80" className="w-full h-full opacity-30">
        <line x1="45" y1="15" x2="45" y2="45" stroke="#60a5fa" strokeWidth="2" />
        <line x1="75" y1="15" x2="75" y2="35" stroke="#60a5fa" strokeWidth="2" />
        <ellipse cx="45" cy="55" rx="18" ry="12" stroke="#60a5fa" strokeWidth="1.5" fill="none" />
        <ellipse cx="75" cy="50" rx="15" ry="10" stroke="#60a5fa" strokeWidth="1.5" fill="none" />
        <rect x="38" y="12" width="14" height="4" rx="1" stroke="#93c5fd" strokeWidth="1" fill="none" />
        <rect x="68" y="12" width="14" height="4" rx="1" stroke="#93c5fd" strokeWidth="1" fill="none" />
      </svg>
    ),
  },
  audio_visual: {
    bg: "bg-pink-950/40",
    pattern: (
      <svg viewBox="0 0 120 80" className="w-full h-full opacity-30">
        <path d="M 25 25 L 25 55 L 50 65 L 50 15 Z" stroke="#f472b6" strokeWidth="1.5" fill="none" />
        <path d="M 55 30 Q 70 40 55 50" stroke="#f472b6" strokeWidth="1.5" fill="none" />
        <path d="M 62 22 Q 82 40 62 58" stroke="#f472b6" strokeWidth="1.5" fill="none" />
        <path d="M 70 15 Q 95 40 70 65" stroke="#f472b6" strokeWidth="1" fill="none" opacity="0.5" />
      </svg>
    ),
  },
  workshop: {
    bg: "bg-amber-950/40",
    pattern: (
      <svg viewBox="0 0 120 80" className="w-full h-full opacity-30">
        <line x1="20" y1="40" x2="100" y2="40" stroke="#f59e0b" strokeWidth="2" />
        <rect x="35" y="20" width="50" height="20" rx="2" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
        <line x1="45" y1="20" x2="45" y2="40" stroke="#fbbf24" strokeWidth="1" />
        <line x1="60" y1="20" x2="60" y2="40" stroke="#fbbf24" strokeWidth="1" />
        <line x1="75" y1="20" x2="75" y2="40" stroke="#fbbf24" strokeWidth="1" />
        <line x1="30" y1="40" x2="30" y2="60" stroke="#f59e0b" strokeWidth="2" />
        <line x1="90" y1="40" x2="90" y2="60" stroke="#f59e0b" strokeWidth="2" />
        <line x1="25" y1="60" x2="95" y2="60" stroke="#f59e0b" strokeWidth="1.5" />
      </svg>
    ),
  },
  space: {
    bg: "bg-cyan-950/40",
    pattern: (
      <svg viewBox="0 0 120 80" className="w-full h-full opacity-30">
        <rect x="15" y="15" width="90" height="55" rx="3" stroke="#22d3ee" strokeWidth="1.5" fill="none" />
        <rect x="45" y="45" width="30" height="25" rx="1" stroke="#22d3ee" strokeWidth="1" fill="none" />
        <rect x="22" y="22" width="25" height="18" rx="1" stroke="#67e8f9" strokeWidth="1" fill="none" strokeDasharray="3 2" />
        <rect x="73" y="22" width="25" height="18" rx="1" stroke="#67e8f9" strokeWidth="1" fill="none" strokeDasharray="3 2" />
      </svg>
    ),
  },
};

interface ResourceImageProps {
  category: ResourceCategory;
  className?: string;
}

export function ResourceImage({ category, className }: ResourceImageProps) {
  const { bg, pattern } = CATEGORY_PATTERNS[category] || CATEGORY_PATTERNS.space;
  return (
    <div className={cn("relative overflow-hidden flex items-center justify-center", bg, className)}>
      <div className="absolute inset-0 flex items-center justify-center">{pattern}</div>
    </div>
  );
}
