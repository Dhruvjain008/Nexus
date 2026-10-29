"use client";
import type { ResourceCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ResourceSchematicProps {
  category: ResourceCategory;
  isAvailable?: boolean;
  className?: string;
}

export function ResourceSchematic({ category, isAvailable = true, className }: ResourceSchematicProps) {
  // Styles per category: grid canvas colors & stroke tints matching Screenshot 2
  const categoryConfigs: Record<
    ResourceCategory,
    {
      bgGradient: string;
      gridLine: string;
      accentBorder: string;
    }
  > = {
    testing: {
      bgGradient: "bg-[#f0f7ff]",
      gridLine: "rgba(59, 130, 246, 0.14)",
      accentBorder: "border-b-2 border-blue-500",
    },
    fabrication: {
      bgGradient: "bg-[#f0fdf4]",
      gridLine: "rgba(16, 185, 129, 0.14)",
      accentBorder: "border-b-2 border-emerald-600",
    },
    imaging: {
      bgGradient: "bg-[#fffbeb]",
      gridLine: "rgba(217, 119, 6, 0.14)",
      accentBorder: "border-b-2 border-amber-600",
    },
    laboratory: {
      bgGradient: "bg-[#f0fdfa]",
      gridLine: "rgba(13, 148, 136, 0.14)",
      accentBorder: "border-b-2 border-teal-600",
    },
    computing: {
      bgGradient: "bg-[#ecfeff]",
      gridLine: "rgba(6, 182, 212, 0.14)",
      accentBorder: "border-b-2 border-cyan-600",
    },
    audio_visual: {
      bgGradient: "bg-[#faf5ff]",
      gridLine: "rgba(139, 92, 246, 0.14)",
      accentBorder: "border-b-2 border-purple-600",
    },
    space: {
      bgGradient: "bg-[#f8fafc]",
      gridLine: "rgba(71, 85, 105, 0.14)",
      accentBorder: "border-b-2 border-slate-600",
    },
    workshop: {
      bgGradient: "bg-[#f4f4f5]",
      gridLine: "rgba(82, 82, 91, 0.14)",
      accentBorder: "border-b-2 border-zinc-600",
    },
  };

  const config = categoryConfigs[category] || categoryConfigs.testing;

  return (
    <div
      className={cn(
        "relative h-44 w-full flex items-center justify-center overflow-hidden select-none",
        config.bgGradient,
        config.accentBorder,
        className
      )}
      style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 19px, ${config.gridLine} 19px, ${config.gridLine} 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, ${config.gridLine} 19px, ${config.gridLine} 20px)`,
      }}
    >
      {/* ── Category Specific Animated Schematic Vector (Matching Screenshot 2) ── */}
      <div className="w-48 h-28 flex items-center justify-center">
        {category === "testing" && (
          <svg width="170" height="100" viewBox="0 0 170 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shaded vertical pillars */}
            <rect x="35" y="45" width="10" height="40" fill="#93c5fd" fillOpacity="0.45" />
            <rect x="65" y="25" width="10" height="60" fill="#93c5fd" fillOpacity="0.55" />
            <rect x="95" y="40" width="10" height="45" fill="#93c5fd" fillOpacity="0.45" />
            <rect x="125" y="30" width="10" height="55" fill="#93c5fd" fillOpacity="0.5" />
            {/* Waveform multi-point line */}
            <polyline
              points="15,75 35,45 65,25 95,70 125,30 155,75"
              stroke="#2563eb"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Glowing peak node */}
            <circle cx="65" cy="25" r="4.5" fill="#1d4ed8" />
            <circle cx="65" cy="25" r="8" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" className="animate-ping" style={{ transformOrigin: "65px 25px", animationDuration: "2.5s" }} />
            <circle cx="35" cy="45" r="3" fill="#2563eb" />
            <circle cx="95" cy="70" r="3" fill="#2563eb" />
            <circle cx="125" cy="30" r="3.5" fill="#2563eb" />
          </svg>
        )}

        {category === "fabrication" && (
          <svg width="170" height="100" viewBox="0 0 170 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer print bed frame */}
            <rect x="35" y="20" width="100" height="68" rx="6" stroke="#059669" strokeWidth="2.4" fill="none" />
            {/* Inner dashed boundary */}
            <rect x="47" y="30" width="76" height="48" rx="3" stroke="#10b981" strokeWidth="1.8" strokeDasharray="4 3" fill="none" />
            {/* Alignment crosshairs */}
            <line x1="85" y1="10" x2="85" y2="20" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
            <line x1="85" y1="88" x2="85" y2="98" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
            <line x1="25" y1="54" x2="35" y2="54" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
            <line x1="135" y1="54" x2="145" y2="54" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
            {/* Center target & nozzle dot */}
            <circle cx="85" cy="54" r="10" stroke="#059669" strokeWidth="2" fill="#d1fae5" fillOpacity="0.8" />
            <circle cx="85" cy="54" r="3" fill="#047857" />
            <circle cx="85" cy="54" r="6" stroke="#10b981" strokeWidth="1" className="animate-ping" style={{ transformOrigin: "85px 54px", animationDuration: "2.5s" }} />
          </svg>
        )}

        {category === "imaging" && (
          <svg width="170" height="100" viewBox="0 0 170 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Camera body */}
            <rect x="35" y="24" width="88" height="62" rx="8" stroke="#b45309" strokeWidth="2.4" fill="none" />
            {/* Viewfinder & grip */}
            <rect x="123" y="32" width="16" height="12" rx="2" stroke="#b45309" strokeWidth="2" fill="none" />
            <rect x="52" y="14" width="32" height="10" rx="3" stroke="#b45309" strokeWidth="2" fill="none" />
            {/* Concentric lens rings */}
            <circle cx="79" cy="55" r="19" stroke="#b45309" strokeWidth="2.2" fill="#fef3c7" fillOpacity="0.4" />
            <circle cx="79" cy="55" r="12" stroke="#d97706" strokeWidth="1.8" fill="none" />
            <circle cx="79" cy="55" r="4.5" fill="#b45309" className="animate-pulse" />
            <circle cx="79" cy="55" r="1.5" fill="#fffbeb" />
            {/* Shutter button */}
            <circle cx="108" cy="34" r="3" fill="#d97706" />
          </svg>
        )}

        {category === "laboratory" && (
          <svg width="170" height="100" viewBox="0 0 170 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Separation column */}
            <rect x="42" y="18" width="14" height="70" rx="4" stroke="#0f766e" strokeWidth="2.2" fill="#ccfbf1" fillOpacity="0.4" />
            <line x1="49" y1="18" x2="49" y2="88" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* Fluidic capillary transfer line */}
            <path d="M 56 28 Q 80 28, 80 50 T 108 50" stroke="#0f766e" strokeWidth="2" fill="none" />
            {/* Photodiode detector array */}
            <circle cx="112" cy="50" r="14" stroke="#0f766e" strokeWidth="2" fill="#ccfbf1" fillOpacity="0.7" />
            <circle cx="112" cy="50" r="5" fill="#0d9488" className="animate-pulse" />
            {/* Vials tray */}
            <rect x="130" y="60" width="24" height="26" rx="3" stroke="#0f766e" strokeWidth="1.8" fill="none" />
            <circle cx="137" cy="73" r="3" fill="#0f766e" />
            <circle cx="147" cy="73" r="3" fill="#0f766e" />
          </svg>
        )}

        {category === "computing" && (
          <svg width="170" height="100" viewBox="0 0 170 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Processor package */}
            <rect x="48" y="22" width="74" height="62" rx="6" stroke="#0891b2" strokeWidth="2.4" fill="#cffafe" fillOpacity="0.3" />
            {/* Compute clusters */}
            <rect x="55" y="28" width="26" height="22" rx="3" stroke="#06b6d4" strokeWidth="1.5" fill="none" />
            <rect x="89" y="28" width="26" height="22" rx="3" stroke="#06b6d4" strokeWidth="1.5" fill="none" />
            <rect x="55" y="56" width="26" height="22" rx="3" stroke="#06b6d4" strokeWidth="1.5" fill="none" />
            <rect x="89" y="56" width="26" height="22" rx="3" stroke="#06b6d4" strokeWidth="1.5" fill="none" />
            {/* Bus traces */}
            <line x1="24" y1="40" x2="48" y2="40" stroke="#0891b2" strokeWidth="2" />
            <line x1="24" y1="66" x2="48" y2="66" stroke="#0891b2" strokeWidth="2" />
            <line x1="122" y1="40" x2="146" y2="40" stroke="#0891b2" strokeWidth="2" />
            <line x1="122" y1="66" x2="146" y2="66" stroke="#0891b2" strokeWidth="2" />
            <circle cx="24" cy="40" r="2.5" fill="#0e7490" className="animate-ping" style={{ transformOrigin: "24px 40px", animationDuration: "2s" }} />
            <circle cx="146" cy="66" r="2.5" fill="#0e7490" className="animate-ping" style={{ transformOrigin: "146px 66px", animationDuration: "2.3s" }} />
          </svg>
        )}

        {category === "audio_visual" && (
          <svg width="170" height="100" viewBox="0 0 170 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Monitor speaker */}
            <rect x="36" y="20" width="48" height="66" rx="6" stroke="#7c3aed" strokeWidth="2.2" fill="none" />
            <circle cx="60" cy="38" r="8" stroke="#7c3aed" strokeWidth="1.8" fill="none" />
            <circle cx="60" cy="65" r="14" stroke="#7c3aed" strokeWidth="2" fill="#f3e8ff" />
            <circle cx="60" cy="65" r="4" fill="#6d28d9" className="animate-pulse" />
            {/* Sound waves */}
            <path d="M 94 38 A 20 20 0 0 1 94 72" stroke="#8b5cf6" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M 108 30 A 32 32 0 0 1 108 80" stroke="#a78bfa" strokeWidth="2" strokeDasharray="3 3" fill="none" strokeLinecap="round" />
            <path d="M 122 22 A 44 44 0 0 1 122 88" stroke="#c4b5fd" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </svg>
        )}

        {category === "space" && (
          <svg width="170" height="100" viewBox="0 0 170 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Cleanroom floorplan */}
            <rect x="36" y="20" width="98" height="68" rx="4" stroke="#475569" strokeWidth="2.2" fill="none" />
            <rect x="36" y="20" width="34" height="34" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 2" fill="#f1f5f9" />
            <path d="M 52 54 A 16 16 0 0 1 68 38" stroke="#475569" strokeWidth="1.5" fill="none" />
            {/* Laminar HEPA airflow symbols */}
            <line x1="88" y1="36" x2="88" y2="52" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" />
            <polygon points="85,50 88,56 91,50" fill="#0f766e" />
            <line x1="112" y1="36" x2="112" y2="52" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" />
            <polygon points="109,50 112,56 115,50" fill="#0f766e" />
            <circle cx="100" cy="74" r="3.5" fill="#0f766e" className="animate-pulse" />
          </svg>
        )}

        {category === "workshop" && (
          <svg width="170" height="100" viewBox="0 0 170 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Spindle collet */}
            <rect x="74" y="16" width="22" height="38" rx="3" stroke="#52525b" strokeWidth="2.2" fill="#e4e4e7" />
            <rect x="81" y="54" width="8" height="18" stroke="#3f3f46" strokeWidth="2" fill="#71717a" />
            {/* Bed & clamp */}
            <rect x="40" y="76" width="90" height="14" rx="2" stroke="#52525b" strokeWidth="2" fill="none" />
            {/* Coordinate indicators */}
            <path d="M 32 46 L 32 28 M 32 46 L 50 46" stroke="#0f766e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <circle cx="85" cy="72" r="3" fill="#059669" className="animate-ping" style={{ transformOrigin: "85px 72px", animationDuration: "2.2s" }} />
          </svg>
        )}
      </div>
    </div>
  );
}
