"use client";

import { create } from "zustand";
import type { Booking, BookingStatus, AuditEvent, ConditionReport, Incident, IncidentSeverity, UserRole } from "../types";
import { BOOKINGS, AUDIT_EVENTS, INCIDENTS } from "../data";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "info" | "success" | "warning";
  read: boolean;
}

interface BookingsState {
  bookings: Booking[];
  auditEvents: AuditEvent[];
  incidents: Incident[];
  notifications: AppNotification[];

  // Actions
  addBooking: (
    newBookingData: Omit<Booking, "id" | "createdAt" | "updatedAt">
  ) => Booking;
  approveBooking: (bookingId: string, approvedByName: string, role?: UserRole) => void;
  rejectBooking: (bookingId: string, rejectedByName: string, reason: string, role?: UserRole) => void;
  waitlistBooking: (bookingId: string, placedByName: string, reason?: string) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  recordConditionReport: (bookingId: string, report: ConditionReport) => void;
  reportIncident: (bookingId: string, reportedBy: string, severity: IncidentSeverity, description: string) => void;
  resolveIncident: (incidentId: string, resolvedBy: string, resolution: string) => void;
  addNotification: (title: string, message: string, type?: "info" | "success" | "warning") => void;
  markNotificationsAsRead: () => void;
  getBookingById: (id: string) => Booking | undefined;
  resetToInitialData: () => void;
}

export const useBookingsStore = create<BookingsState>((set, get) => ({
  bookings: BOOKINGS,
  auditEvents: AUDIT_EVENTS,
  incidents: INCIDENTS,
  notifications: [
    {
      id: "n-1",
      title: "System Ready",
      message: "NEXUS multi-institution network connected across 4 campuses.",
      timestamp: "Just now",
      type: "info",
      read: false,
    },
    {
      id: "n-2",
      title: "FairShare Engine Active",
      message: "Anti-hoarding priority algorithms enabled for high-demand assets.",
      timestamp: "5m ago",
      type: "success",
      read: false,
    },
  ],

  addBooking: (newBookingData) => {
    const id = `bk-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();
    const newBooking: Booking = {
      ...newBookingData,
      id,
      status: "PENDING_APPROVAL",
      createdAt: now,
      updatedAt: now,
    };

    const auditEntry: AuditEvent = {
      id: `ae-${Date.now().toString().slice(-4)}`,
      bookingId: id,
      action: "Booking Requested",
      performedBy: newBooking.user.name,
      performedByRole: newBooking.user.role,
      timestamp: now,
      details: {
        resourceName: newBooking.resource.name,
        purpose: newBooking.purpose,
        startTime: newBooking.startTime,
        fairShareScore: newBooking.fairShareScore,
      },
    };

    const notification: AppNotification = {
      id: `n-${Date.now()}`,
      title: "New Booking Request",
      message: `${newBooking.user.name} requested ${newBooking.resource.name}`,
      timestamp: "Just now",
      type: "info",
      read: false,
    };

    set((state) => ({
      bookings: [newBooking, ...state.bookings],
      auditEvents: [auditEntry, ...state.auditEvents],
      notifications: [notification, ...state.notifications],
    }));

    return newBooking;
  },

  approveBooking: (bookingId, approvedByName, role = "owner") => {
    const now = new Date().toISOString();
    set((state) => {
      let resourceName = "Resource";
      const updatedBookings = state.bookings.map((b) => {
        if (b.id === bookingId) {
          resourceName = b.resource.name;
          return {
            ...b,
            status: "APPROVED" as BookingStatus,
            approvedBy: approvedByName,
            approvedAt: now,
            updatedAt: now,
          };
        }
        return b;
      });

      const auditEntry: AuditEvent = {
        id: `ae-${Date.now().toString().slice(-4)}`,
        bookingId,
        action: `Approved by ${approvedByName}`,
        performedBy: approvedByName,
        performedByRole: role,
        timestamp: now,
        details: { status: "APPROVED", approvedAt: now },
      };

      const notification: AppNotification = {
        id: `n-${Date.now()}`,
        title: "Booking Approved",
        message: `${resourceName} approved by ${approvedByName}`,
        timestamp: "Just now",
        type: "success",
        read: false,
      };

      return {
        bookings: updatedBookings,
        auditEvents: [auditEntry, ...state.auditEvents],
        notifications: [notification, ...state.notifications],
      };
    });
  },

  rejectBooking: (bookingId, rejectedByName, reason, role = "owner") => {
    const now = new Date().toISOString();
    set((state) => {
      const updatedBookings = state.bookings.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: "REJECTED" as BookingStatus,
            rejectionReason: reason,
            updatedAt: now,
          };
        }
        return b;
      });

      const auditEntry: AuditEvent = {
        id: `ae-${Date.now().toString().slice(-4)}`,
        bookingId,
        action: `Rejected by ${rejectedByName}`,
        performedBy: rejectedByName,
        performedByRole: role,
        timestamp: now,
        details: { status: "REJECTED", reason },
      };

      return {
        bookings: updatedBookings,
        auditEvents: [auditEntry, ...state.auditEvents],
      };
    });
  },

  waitlistBooking: (bookingId, placedByName, reason = "Placed in priority queue under FairShare algorithm") => {
    const now = new Date().toISOString();
    set((state) => {
      let resourceName = "Resource";
      const updatedBookings = state.bookings.map((b) => {
        if (b.id === bookingId) {
          resourceName = b.resource.name;
          return {
            ...b,
            status: "WAITLISTED" as BookingStatus,
            waitlistPosition: 2,
            updatedAt: now,
          };
        }
        return b;
      });

      const auditEntry: AuditEvent = {
        id: `ae-${Date.now().toString().slice(-4)}`,
        bookingId,
        action: `Queued on Waitlist by ${placedByName}`,
        performedBy: placedByName,
        performedByRole: "owner",
        timestamp: now,
        details: { status: "WAITLISTED", reason },
      };

      const notification: AppNotification = {
        id: `n-${Date.now()}`,
        title: "Waitlist Placement",
        message: `${resourceName} request placed in waitlist by custodian.`,
        timestamp: "Just now",
        type: "warning",
        read: false,
      };

      return {
        bookings: updatedBookings,
        auditEvents: [auditEntry, ...state.auditEvents],
        notifications: [notification, ...state.notifications],
      };
    });
  },

  updateBookingStatus: (bookingId, status) => {
    const now = new Date().toISOString();
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status, updatedAt: now } : b
      ),
    }));
  },

  recordConditionReport: (bookingId, report) => {
    const now = new Date().toISOString();
    set((state) => {
      const isCheckIn = report.phase === "CHECK_IN";
      const nextStatus: BookingStatus = report.aiDiscrepancyFlag
        ? "INCIDENT_FLAGGED"
        : isCheckIn
        ? "CHECKED_OUT"
        : "COMPLETED";

      const updatedBookings = state.bookings.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: nextStatus,
            checkInReport: isCheckIn ? report : b.checkInReport,
            returnReport: !isCheckIn ? report : b.returnReport,
            updatedAt: now,
          };
        }
        return b;
      });

      const auditEntry: AuditEvent = {
        id: `ae-${Date.now().toString().slice(-4)}`,
        bookingId,
        action: isCheckIn ? "Pre-Use Inspection Co-Signed" : "Post-Use Return Verified",
        performedBy: report.recordedBy,
        performedByRole: "user",
        timestamp: now,
        details: { phase: report.phase, checklistItemsCount: report.checklist.length },
      };

      const notification: AppNotification = {
        id: `n-${Date.now()}`,
        title: isCheckIn ? "Check-In Verified" : "Return Completed",
        message: isCheckIn
          ? "Pre-use condition baseline signed & hardware issued."
          : "Hardware returned. Custodian inspection confirmed.",
        timestamp: "Just now",
        type: "success",
        read: false,
      };

      return {
        bookings: updatedBookings,
        auditEvents: [auditEntry, ...state.auditEvents],
        notifications: [notification, ...state.notifications],
      };
    });
  },

  reportIncident: (bookingId, reportedBy, severity, description) => {
    const now = new Date().toISOString();
    const incidentId = `inc-${Date.now().toString().slice(-4)}`;
    const newIncident: Incident = {
      id: incidentId,
      bookingId,
      reportedBy,
      reportedAt: now,
      severity,
      description,
      photoUrls: [],
      status: "open",
    };

    const auditEntry: AuditEvent = {
      id: `ae-${Date.now().toString().slice(-4)}`,
      bookingId,
      action: `Incident Flagged (${severity})`,
      performedBy: reportedBy,
      performedByRole: "user",
      timestamp: now,
      details: { severity, description },
    };

    const notification: AppNotification = {
      id: `n-${Date.now()}`,
      title: "Hardware Incident Flagged",
      message: `${severity.toUpperCase()}: ${description.slice(0, 50)}...`,
      timestamp: "Just now",
      type: "warning",
      read: false,
    };

    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "INCIDENT_FLAGGED", updatedAt: now } : b
      ),
      incidents: [newIncident, ...state.incidents],
      auditEvents: [auditEntry, ...state.auditEvents],
      notifications: [notification, ...state.notifications],
    }));
  },

  resolveIncident: (incidentId, resolvedBy, resolution) => {
    const now = new Date().toISOString();
    set((state) => {
      const targetInc = state.incidents.find((i) => i.id === incidentId);
      const updatedIncidents = state.incidents.map((i) =>
        i.id === incidentId
          ? {
              ...i,
              status: "resolved" as const,
              resolvedBy,
              resolvedAt: now,
              resolution,
            }
          : i
      );

      const auditEntry: AuditEvent = {
        id: `ae-${Date.now().toString().slice(-4)}`,
        bookingId: targetInc?.bookingId || "incident",
        action: `Incident Resolved by ${resolvedBy}`,
        performedBy: resolvedBy,
        performedByRole: "manager",
        timestamp: now,
        details: { incidentId, resolution },
      };

      const notification: AppNotification = {
        id: `n-${Date.now()}`,
        title: "Incident Resolved",
        message: `Case ${incidentId} resolved by ${resolvedBy}`,
        timestamp: "Just now",
        type: "success",
        read: false,
      };

      return {
        incidents: updatedIncidents,
        auditEvents: [auditEntry, ...state.auditEvents],
        notifications: [notification, ...state.notifications],
      };
    });
  },

  addNotification: (title, message, type = "info") => {
    const newNotif: AppNotification = {
      id: `n-${Date.now()}`,
      title,
      message,
      timestamp: "Just now",
      type,
      read: false,
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
    }));
  },

  markNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  getBookingById: (id) => {
    return get().bookings.find((b) => b.id === id);
  },

  resetToInitialData: () => {
    set({
      bookings: BOOKINGS,
      auditEvents: AUDIT_EVENTS,
      incidents: INCIDENTS,
      notifications: [
        {
          id: "n-1",
          title: "System Ready",
          message: "NEXUS multi-institution network connected across 4 campuses.",
          timestamp: "Just now",
          type: "info",
          read: false,
        },
      ],
    });
  },
}));
