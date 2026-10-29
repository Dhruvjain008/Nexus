"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Textarea } from "@/components/ui/Input";
import { useAuthStore } from "@/lib/store/auth";
import { useBookingsStore } from "@/lib/store/bookings";
import { useResourcesStore } from "@/lib/store/resources";
import type { ResourceCategory } from "@/lib/types";
import { formatDateTime, formatDuration, cn } from "@/lib/utils";
import {
  Package,
  ClipboardList,
  Activity,
  AlertTriangle,
  Check,
  X,
  MessageSquare,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Plus,
  Link as LinkIcon,
  Clock,
  AlertCircle,
  Ban,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-5">
        <div className={cn("p-2.5 rounded-lg", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

type ActionState = "approved" | "rejected" | "info_requested" | null;

export default function OwnerDashboardPage() {
  const { currentUser } = useAuthStore();
  const { bookings, approveBooking, rejectBooking, waitlistBooking } = useBookingsStore();
  const { resources, addResource, toggleAvailability: toggleResourceAvail } = useResourcesStore();
  const [bookingActions, setBookingActions] = useState<Record<string, ActionState>>({});
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [availabilityToggles, setAvailabilityToggles] = useState<Record<string, boolean>>({});

  // Create Resource Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [resName, setResName] = useState("");
  const [resModel, setResModel] = useState("");
  const [resCategory, setResCategory] = useState<ResourceCategory>("laboratory");
  const [resLocation, setResLocation] = useState("");
  const [resRate, setResRate] = useState("45");
  const [resMaxHours, setResMaxHours] = useState("8");
  const [resCooldown, setResCooldown] = useState("24");
  const [resTier, setResTier] = useState<1 | 2 | 3>(2);
  const [resDesc, setResDesc] = useState("");
  const [resRuleLabel, setResRuleLabel] = useState("Laboratory Safety Induction");

  if (!currentUser || !["owner", "manager", "admin"].includes(currentUser.role)) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] text-slate-800">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center gap-4 text-center">
          <Ban className="w-10 h-10 text-slate-300" />
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Access Denied</h2>
          <p className="text-sm text-slate-500 max-w-sm">
            The Owner Portal is restricted to resource owners, managers, and administrators.
          </p>
        </div>
      </div>
    );
  }

  const ownerResources = resources.filter((r) => r.ownerId === currentUser.id);
  const pendingBookings = bookings.filter((b) => b.status === "PENDING_APPROVAL");
  const activeAllocations = bookings.filter((b) =>
    ["APPROVED", "CHECKED_OUT", "RETURN_INSPECTION"].includes(b.status)
  );
  const now = new Date();

  const stats = {
    totalResources: ownerResources.length || resources.length,
    pendingRequests: pendingBookings.length,
    activeCheckouts: activeAllocations.length,
    incidentsThisMonth: 0,
  };

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resName.trim() || !resDesc.trim()) return;

    addResource({
      name: resName.trim(),
      modelNumber: resModel.trim() || undefined,
      category: resCategory,
      description: resDesc.trim(),
      ownerOrgId: currentUser.organization.toLowerCase().replace(/\s+/g, "-"),
      ownerOrgName: currentUser.organization,
      ownerName: currentUser.name,
      ownerId: currentUser.id,
      location: resLocation.trim() || "Main Lab Facility",
      images: [],
      hourlyRate: Number(resRate) || 0,
      creditBased: Number(resRate) === 0,
      approvalPolicy: "owner_review",
      eligibilityRules: [
        {
          type: "credential",
          label: resRuleLabel.trim() || "Safety Clearance",
          description: "Mandatory qualification verified prior to equipment handover.",
          required: true,
        },
      ],
      maxBookingHours: Number(resMaxHours) || 8,
      cooldownHours: Number(resCooldown) || 24,
      safetyTier: resTier,
      isAvailable: true,
      availabilitySlots: [],
      tags: [resCategory, "institutional", "verified"],
    });

    setIsCreateOpen(false);
    setResName("");
    setResModel("");
    setResDesc("");
  };

  const handleApprove = (id: string) => {
    approveBooking(id, currentUser.name, currentUser.role);
    setBookingActions((prev) => ({ ...prev, [id]: "approved" }));
  };

  const handleWaitlist = (id: string) => {
    waitlistBooking(id, currentUser.name);
    setBookingActions((prev) => ({ ...prev, [id]: "info_requested" }));
  };

  const handleReject = (id: string) => {
    setRejectModalId(id);
    setRejectReason("");
  };

  const confirmReject = () => {
    if (!rejectModalId) return;
    rejectBooking(rejectModalId, currentUser.name, rejectReason || "Declined by owner", currentUser.role);
    setBookingActions((prev) => ({ ...prev, [rejectModalId]: "rejected" }));
    setRejectModalId(null);
    setRejectReason("");
  };

  const handleRequestInfo = (id: string) =>
    setBookingActions((prev) => ({ ...prev, [id]: "info_requested" }));

  const toggleAvailability = (resourceId: string, current: boolean) =>
    setAvailabilityToggles((prev) => ({ ...prev, [resourceId]: !(prev[resourceId] ?? current) }));

  const displayResources = ownerResources.length > 0 ? ownerResources : resources;

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-800">
      <Navbar />

      {/* Reject modal */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Reject Request</h3>
            <p className="text-sm text-slate-500">Provide a reason so the requester can take action.</p>
            <Textarea
              label="Rejection reason"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Slot already reserved, insufficient credentials..."
            />
            <div className="flex items-center gap-2 justify-end">
              <Button variant="secondary" size="sm" onClick={() => setRejectModalId(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={!rejectReason.trim()}
                onClick={confirmReject}
              >
                Confirm Reject
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Owner Portal</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">{currentUser.organization}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Total Resources"
            value={stats.totalResources}
            icon={Package}
            color="bg-teal-50 text-teal-700"
          />
          <StatCard
            label="Pending Requests"
            value={stats.pendingRequests}
            icon={ClipboardList}
            color="bg-amber-50 text-amber-700"
          />
          <StatCard
            label="Active Checkouts"
            value={stats.activeCheckouts}
            icon={Activity}
            color="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            label="Incidents This Month"
            value={stats.incidentsThisMonth}
            icon={AlertTriangle}
            color="bg-rose-50 text-rose-700"
          />
        </div>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Pending Requests
              </h2>
              {pendingBookings.length > 0 && (
                <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold ml-1">
                  {pendingBookings.length} awaiting
                </span>
              )}
            </div>
          </CardHeader>

          {pendingBookings.length === 0 ? (
            <CardContent>
              <div className="py-10 flex flex-col items-center gap-2 text-center">
                <Check className="w-8 h-8 text-emerald-600" />
                <p className="text-sm text-slate-500 font-medium">All caught up. No pending requests.</p>
              </div>
            </CardContent>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingBookings.map((booking) => {
                const action = bookingActions[booking.id];
                return (
                  <div key={booking.id} className="px-5 py-4 space-y-3 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-900">
                            {booking.user.name}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            <ShieldCheck className="w-3 h-3" />
                            {booking.user.trustScore}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 font-medium">{booking.resource.name}</p>
                        <p className="text-xs text-slate-500">
                          {formatDateTime(booking.startTime)} &mdash; {formatDateTime(booking.endTime)}{" "}
                          <span className="text-slate-400">
                            ({formatDuration(booking.startTime, booking.endTime)})
                          </span>
                        </p>
                        <p className="text-xs text-slate-600 truncate max-w-md">{booking.purpose}</p>
                      </div>
                    </div>

                    {action ? (
                      <div
                        className={cn(
                          "text-xs px-3 py-2 rounded-md font-medium border",
                          action === "approved"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : action === "rejected"
                            ? "bg-rose-50 text-rose-800 border-rose-200"
                            : "bg-blue-50 text-blue-800 border-blue-200"
                        )}
                      >
                        {action === "approved"
                          ? "Approved. Requester notified."
                          : action === "rejected"
                          ? "Rejected. Reason sent to requester."
                          : "More info requested. Awaiting response."}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          size="sm"
                          className="bg-teal-700 hover:bg-teal-800 text-white font-semibold shadow-xs"
                          onClick={() => handleApprove(booking.id)}
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleReject(booking.id)}
                        >
                          <X className="w-3.5 h-3.5 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleWaitlist(booking.id)}
                        >
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          Place on Waitlist
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* My Resources */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-teal-700" />
                <h2 className="text-base font-bold text-slate-900 tracking-tight">My Resources</h2>
              </div>
              <Button size="sm" variant="primary" onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-3.5 h-3.5" />
                List New Resource
              </Button>
            </div>
          </CardHeader>

          <div className="divide-y divide-slate-100">
            {displayResources.map((resource) => {
              const isAvailable =
                availabilityToggles[resource.id] !== undefined
                  ? availabilityToggles[resource.id]
                  : resource.isAvailable;
              const bookingCount = bookings.filter((b) => b.resourceId === resource.id).length;
              return (
                <div
                  key={resource.id}
                  className="px-5 py-4 flex items-center gap-4 flex-wrap hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-bold text-slate-900">{resource.name}</p>
                    <p className="text-xs text-slate-500">{resource.location}</p>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0 flex-wrap">
                    {/* Utilization bar */}
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-slate-500 font-medium">{resource.utilizationRate}% utilized</span>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            resource.utilizationRate > 80
                              ? "bg-rose-500"
                              : resource.utilizationRate > 50
                              ? "bg-amber-500"
                              : "bg-teal-600"
                          )}
                          style={{ width: `${resource.utilizationRate}%` }}
                        />
                      </div>
                    </div>

                    <span className="text-xs text-slate-500 font-medium">{bookingCount} bookings</span>

                    {/* Availability toggle */}
                    <button
                      onClick={() => toggleAvailability(resource.id, resource.isAvailable)}
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-semibold rounded-md px-2.5 py-1 border transition-colors shadow-2xs",
                        isAvailable
                          ? "border-emerald-200 text-emerald-800 bg-emerald-50"
                          : "border-slate-200 text-slate-500 bg-slate-100"
                      )}
                    >
                      {isAvailable ? (
                        <ToggleRight className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      {isAvailable ? "Available" : "Unavailable"}
                    </button>

                    <Button size="sm" variant="ghost">
                      <LinkIcon className="w-3.5 h-3.5" />
                      Manage
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Active & Approved Allocations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Active & Approved Allocations
                </h2>
                {activeAllocations.length > 0 && (
                  <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold ml-1">
                    {activeAllocations.length} Active
                  </span>
                )}
              </div>
            </div>
          </CardHeader>

          {activeAllocations.length === 0 ? (
            <CardContent>
              <div className="py-10 flex flex-col items-center gap-2 text-center">
                <Clock className="w-8 h-8 text-slate-300" />
                <p className="text-sm text-slate-500 font-medium">No resources currently approved or checked out.</p>
              </div>
            </CardContent>
          ) : (
            <div className="divide-y divide-slate-100">
              {activeAllocations.map((booking) => {
                const isOverdue = new Date(booking.endTime) < now && booking.status === "CHECKED_OUT";
                return (
                  <div key={booking.id} className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap hover:bg-slate-50/50 transition-colors">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-slate-900">{booking.resource.name}</p>
                        <StatusBadge status={booking.status} />
                        {booking.approvedBy && (
                          <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                            Approved by {booking.approvedBy}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">
                        Borrower: <strong className="text-slate-900">{booking.user.name}</strong> ({booking.user.organization}) · Purpose: {booking.purpose}
                      </p>
                      <p className="text-xs text-slate-500">
                        Window: {formatDateTime(booking.startTime)} &mdash; {formatDateTime(booking.endTime)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {isOverdue && (
                        <span className="inline-flex items-center gap-1 text-xs text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Overdue
                        </span>
                      )}
                      <Link href={`/bookings/${booking.id}`}>
                        <Button size="sm" variant="secondary">
                          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-700" />
                          View Handover & Lifecycle →
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* List New Resource Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4 py-6 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-xl p-6 space-y-4 my-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-teal-700" />
                  List Institutional Resource
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publish idle laboratory, workshop, or technical equipment to the NEXUS directory.
                </p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Equipment Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Agilent Cary 60 UV-Vis"
                    value={resName}
                    onChange={(e) => setResName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Model / Spec Number</label>
                  <input
                    type="text"
                    placeholder="e.g. G6860A"
                    value={resModel}
                    onChange={(e) => setResModel(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={resCategory}
                    onChange={(e) => setResCategory(e.target.value as ResourceCategory)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 capitalize focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs font-medium"
                  >
                    {["laboratory", "testing", "fabrication", "computing", "imaging", "audio_visual", "workshop", "space"].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hourly Rate (₹ or 0)</label>
                  <input
                    type="number"
                    min="0"
                    value={resRate}
                    onChange={(e) => setResRate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Safety Tier</label>
                  <select
                    value={resTier}
                    onChange={(e) => setResTier(Number(e.target.value) as 1 | 2 | 3)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs font-medium"
                  >
                    <option value={1}>Tier 1: Open Access</option>
                    <option value={2}>Tier 2: Trained Personnel</option>
                    <option value={3}>Tier 3: Supervised Use</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Physical Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Building 18, Room 204"
                    value={resLocation}
                    onChange={(e) => setResLocation(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Max Duration (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    value={resMaxHours}
                    onChange={(e) => setResMaxHours(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Cooldown Window (Hours)</label>
                  <input
                    type="number"
                    min="0"
                    value={resCooldown}
                    onChange={(e) => setResCooldown(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mandatory Credential / Qualification</label>
                <input
                  type="text"
                  placeholder="e.g. UV-Vis Spectroscopy Operator Certification"
                  value={resRuleLabel}
                  onChange={(e) => setResRuleLabel(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Technical Description & Usage Rules *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe technical capabilities, calibration requirements, and safety protocols..."
                  value={resDesc}
                  onChange={(e) => setResDesc(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Publish to Network
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
