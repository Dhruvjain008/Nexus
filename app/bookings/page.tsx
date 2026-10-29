"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BookingRow } from "@/components/bookings/BookingRow";
import { useAuthStore } from "@/lib/store/auth";
import { useBookingsStore } from "@/lib/store/bookings";
import type { BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

const STATUS_TABS: { label: string; statuses: BookingStatus[] | "all" }[] = [
  { label: "All", statuses: "all" },
  { label: "Active", statuses: ["CHECKED_OUT", "APPROVED"] },
  { label: "Pending", statuses: ["REQUESTED", "PENDING_APPROVAL", "ELIGIBILITY_FAILED"] },
  { label: "Waitlisted", statuses: ["WAITLISTED"] },
  { label: "Completed", statuses: ["COMPLETED", "RESOLVED"] },
  { label: "Cancelled", statuses: ["REJECTED", "CANCELLED", "INCIDENT_FLAGGED"] },
];

export default function BookingsPage() {
  const { currentUser } = useAuthStore();
  const { bookings } = useBookingsStore();
  const [activeTab, setActiveTab] = useState(0);

  const userBookings = currentUser
    ? bookings.filter((b) => b.userId === currentUser.id)
    : bookings; // show all for demo if no user

  const filtered =
    STATUS_TABS[activeTab].statuses === "all"
      ? userBookings
      : userBookings.filter((b) =>
          (STATUS_TABS[activeTab].statuses as BookingStatus[]).includes(b.status)
        );

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-800">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track all your resource requests and active bookings.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 mb-6 overflow-x-auto pb-px">
          {STATUS_TABS.map((tab, i) => {
            const count =
              tab.statuses === "all"
                ? userBookings.length
                : userBookings.filter((b) =>
                    (tab.statuses as BookingStatus[]).includes(b.status)
                  ).length;
            return (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2.5 text-sm transition-colors whitespace-nowrap border-b-2 -mb-px",
                  activeTab === i
                    ? "text-teal-700 border-teal-600 font-bold"
                    : "text-slate-500 border-transparent hover:text-slate-800 font-medium"
                )}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded font-bold min-w-[20px] text-center",
                      activeTab === i
                        ? "bg-teal-50 text-teal-700 border border-teal-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Booking list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 bg-white border border-slate-200/90 rounded-xl flex items-center justify-center mb-4 shadow-2xs">
              <BookOpen className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No bookings found</p>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 0
                ? "You have no bookings yet."
                : "No bookings match this filter."}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/90 rounded-xl divide-y divide-slate-100 overflow-hidden shadow-xs">
            {filtered.map((booking) => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
