"use client";

import { useState, useMemo } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ORGANISATIONS } from "@/lib/data";
import { useResourcesStore } from "@/lib/store/resources";
import type { ResourceCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: { value: ResourceCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "laboratory", label: "Laboratory" },
  { value: "computing", label: "Computing" },
  { value: "imaging", label: "Imaging" },
  { value: "fabrication", label: "Fabrication" },
  { value: "audio_visual", label: "Audio/Visual" },
  { value: "workshop", label: "Workshop" },
  { value: "space", label: "Space" },
  { value: "testing", label: "Testing" },
];

const SAFETY_TIERS: { value: "all" | 1 | 2 | 3; label: string }[] = [
  { value: "all", label: "All" },
  { value: 1, label: "Tier 1: Open" },
  { value: 2, label: "Tier 2: Trained" },
  { value: 3, label: "Tier 3: Supervised" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  const { resources } = useResourcesStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ResourceCategory | "all">("all");
  const [safetyTier, setSafetyTier] = useState<"all" | 1 | 2 | 3>("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [orgFilter, setOrgFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return resources.filter((r) => {
      if (q) {
        const haystack =
          r.name.toLowerCase() +
          " " +
          r.description.toLowerCase() +
          " " +
          r.tags.join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (category !== "all" && r.category !== category) return false;
      if (safetyTier !== "all" && r.safetyTier !== safetyTier) return false;
      if (onlyAvailable && !r.isAvailable) return false;
      if (orgFilter !== "all" && r.ownerOrgId !== orgFilter) return false;
      return true;
    });
  }, [search, category, safetyTier, onlyAvailable, orgFilter]);

  const hasActiveFilters =
    search !== "" ||
    category !== "all" ||
    safetyTier !== "all" ||
    onlyAvailable ||
    orgFilter !== "all";

  function clearFilters() {
    setSearch("");
    setCategory("all");
    setSafetyTier("all");
    setOnlyAvailable(false);
    setOrgFilter("all");
  }

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-800">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Browse Resources
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Discover available spaces, equipment and tools from verified institutions.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, description or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "w-full bg-white border border-slate-300 rounded-lg shadow-xs",
              "pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400",
              "focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            )}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="space-y-3 mb-6">
          {/* Category pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-md transition-colors shadow-xs",
                  category === cat.value
                    ? "bg-teal-700 text-white"
                    : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Safety tier + availability + org */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Safety tier */}
            <div className="flex items-center gap-1">
              {SAFETY_TIERS.map((tier) => (
                <button
                  key={String(tier.value)}
                  onClick={() => setSafetyTier(tier.value)}
                  className={cn(
                    "px-3 py-1 text-xs font-semibold rounded-md transition-colors shadow-xs",
                    safetyTier === tier.value
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50"
                  )}
                >
                  {tier.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <span className="h-4 w-px bg-slate-200 hidden sm:block" />

            {/* Availability toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setOnlyAvailable(!onlyAvailable)}
                className={cn(
                  "relative w-8 h-4 rounded-full transition-colors",
                  onlyAvailable ? "bg-teal-600" : "bg-slate-300"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-xs",
                    onlyAvailable ? "left-4.5" : "left-0.5"
                  )}
                  style={{ left: onlyAvailable ? "18px" : "2px" }}
                />
              </div>
              <span className="text-xs text-slate-600 font-medium">Show only available</span>
            </label>

            {/* Divider */}
            <span className="h-4 w-px bg-slate-200 hidden sm:block" />

            {/* Org filter */}
            <select
              value={orgFilter}
              onChange={(e) => setOrgFilter(e.target.value)}
              className={cn(
                "bg-white border border-slate-300 rounded-md text-xs text-slate-700 shadow-xs font-medium",
                "px-3 py-1.5 focus:outline-none focus:border-teal-600 transition-colors cursor-pointer"
              )}
            >
              <option value="all">All organisations</option>
              {ORGANISATIONS.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results bar */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="text-slate-900 font-semibold">{filtered.length}</span>{" "}
            of{" "}
            <span className="text-slate-900 font-semibold">{resources.length}</span>{" "}
            resources
          </p>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium"
            >
              <X className="w-3.5 h-3.5" />
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <SlidersHorizontal className="w-10 h-10 text-slate-300 mb-4" />
            <p className="text-slate-800 font-semibold">No resources match your filters</p>
            <p className="text-slate-500 text-sm mt-1 mb-5">
              Try broadening your search or adjusting the filters above.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-semibold rounded-md bg-teal-700 text-white hover:bg-teal-800 transition-colors shadow-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
