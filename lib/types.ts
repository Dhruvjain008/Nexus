// ─── Core Domain Types ────────────────────────────────────────────────────────

export type UserRole = "user" | "owner" | "manager" | "admin";

export type BookingStatus =
  | "DRAFT"
  | "REQUESTED"
  | "ELIGIBILITY_FAILED"
  | "WAITLISTED"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "CHECKED_OUT"
  | "RETURN_INSPECTION"
  | "COMPLETED"
  | "INCIDENT_FLAGGED"
  | "RESOLVED"
  | "CANCELLED";

export type ResourceCategory =
  | "laboratory"
  | "computing"
  | "imaging"
  | "fabrication"
  | "audio_visual"
  | "workshop"
  | "space"
  | "testing";

export type ApprovalPolicy = "auto" | "owner_review" | "manager_review";

export type ConditionPhase = "CHECK_IN" | "RETURN";

export type IncidentSeverity = "minor" | "moderate" | "severe";

// ─── User ─────────────────────────────────────────────────────────────────────

export interface Credential {
  id: string;
  name: string;
  issuedBy: string;
  validUntil: string;
  verified: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  department?: string;
  avatar?: string;
  trustScore: number; // 0–100
  hoursUsedThisMonth: number;
  incidentCount: number;
  credentials: Credential[];
  joinedAt: string;
}

// ─── Resource ─────────────────────────────────────────────────────────────────

export interface EligibilityRule {
  type: "credential" | "role" | "approval";
  label: string;
  description: string;
  required: boolean;
}

export interface AvailabilitySlot {
  date: string; // ISO date string
  available: boolean;
}

export interface Resource {
  id: string;
  name: string;
  modelNumber?: string;
  category: ResourceCategory;
  description: string;
  ownerOrgId: string;
  ownerOrgName: string;
  ownerName: string;
  ownerId: string;
  location: string;
  building?: string;
  floor?: string;
  images: string[];
  hourlyRate: number; // 0 = free
  creditBased: boolean;
  approvalPolicy: ApprovalPolicy;
  eligibilityRules: EligibilityRule[];
  maxBookingHours: number;
  cooldownHours: number; // hours before same user can rebook
  safetyTier: 1 | 2 | 3; // 1 = open access, 2 = trained only, 3 = supervised
  isAvailable: boolean;
  availabilitySlots: AvailabilitySlot[];
  tags: string[];
  createdAt: string;
  totalBookings: number;
  utilizationRate: number; // 0–100%
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export interface ConditionItem {
  id: string;
  label: string;
  checkedOk: boolean;
  note?: string;
}

export interface ConditionReport {
  id: string;
  bookingId: string;
  phase: ConditionPhase;
  checklist: ConditionItem[];
  photoUrls: string[];
  aiAnalysisNotes?: string;
  aiDiscrepancyFlag?: boolean;
  signedByUser: boolean;
  signedByOwner: boolean;
  recordedAt: string;
  recordedBy: string;
}

export interface Booking {
  id: string;
  resourceId: string;
  resource: Resource;
  userId: string;
  user: User;
  startTime: string;
  endTime: string;
  purpose: string;
  status: BookingStatus;
  fairShareScore: number;
  waitlistPosition?: number;
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  checkInReport?: ConditionReport;
  returnReport?: ConditionReport;
  createdAt: string;
  updatedAt: string;
}

// ─── Audit Ledger ─────────────────────────────────────────────────────────────

export interface AuditEvent {
  id: string;
  bookingId: string;
  action: string;
  performedBy: string;
  performedByRole: UserRole;
  timestamp: string;
  details: Record<string, unknown>;
  prevHash?: string; // tamper-evident chain
}

// ─── Incident ─────────────────────────────────────────────────────────────────

export interface Incident {
  id: string;
  bookingId: string;
  reportedBy: string;
  reportedAt: string;
  severity: IncidentSeverity;
  description: string;
  photoUrls: string[];
  resolvedBy?: string;
  resolvedAt?: string;
  resolution?: string;
  status: "open" | "under_review" | "resolved";
}

// ─── Organisation ─────────────────────────────────────────────────────────────

export interface Organisation {
  id: string;
  name: string;
  type: "college" | "laboratory" | "makerspace" | "business" | "community";
  verified: boolean;
  resourceCount: number;
  memberCount: number;
  location: string;
}

// ─── FairShare ────────────────────────────────────────────────────────────────

export interface FairShareScore {
  userId: string;
  score: number;
  breakdown: {
    urgencyWeight: number;
    firstTimeBonus: number;
    hoursUsedThisMonth: number;
    incidentPenalty: number;
  };
  rank: number;
  explanation: string;
}
