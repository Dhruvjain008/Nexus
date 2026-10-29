import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import {
  Compass,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  AlertTriangle,
  Scale,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  Layers,
  Lock,
  FileText,
} from "lucide-react";

export const metadata = {
  title: "Platform Guide & How to Use | NEXUS",
  description: "Comprehensive user guide and judge evaluation walkthrough for NEXUS.",
};

const STEPS = [
  {
    step: "01",
    title: "Resource Discovery & Intelligent Matching",
    role: "Guest or Borrower (User)",
    icon: Compass,
    color: "text-blue-700 bg-blue-50 border-blue-200",
    description:
      "Explore verified institutional assets across research labs, universities, and makerspaces. Filter by Safety Tier (T1 Open Access, T2 Certified Operator, T3 Supervised Use), immediate availability, or member hubs.",
    action: "Visit the Resource Catalog (/resources) and use the search bar or category filters.",
  },
  {
    step: "02",
    title: "Booking Request & Algorithmic FairShare",
    role: "User (Arjun Mehta)",
    icon: CalendarCheck,
    color: "text-teal-700 bg-teal-50 border-teal-200",
    description:
      "Select a resource, declare your research purpose, and select a time window. The FairShare algorithm computes your real-time priority score based on monthly hours used, request urgency, and history. If competing slots overlap, you are placed on a transparent waitlist.",
    action: "Click any resource card, pick a date & time, and submit your reservation request.",
  },
  {
    step: "03",
    title: "Owner Review & Verification Governance",
    role: "Resource Owner (Dr. Rajesh Rawal)",
    icon: CheckCircle2,
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    description:
      "Lab custodians review incoming requests against credential prerequisites (e.g., safety inductions, certifications). Owners can approve, reject with feedback, or request additional technical details.",
    action: "Use the bottom-right switcher to switch to Dr. Rajesh Rawal, open Owner Portal, and click 'Approve'.",
  },
  {
    step: "04",
    title: "Pre-Use Inspection & Chain of Custody",
    role: "User & Site Custodian",
    icon: ClipboardCheck,
    color: "text-indigo-700 bg-indigo-50 border-indigo-200",
    description:
      "Before physical handover, both borrower and manager complete a mandatory pre-use condition inspection. Baseline photographs and multi-point checklists verify hardware calibration and cosmetic state.",
    action: "Open the approved booking (/bookings/[id]) and complete the check-in condition checklist.",
  },
  {
    step: "05",
    title: "Post-Use Return & Condition Reporting",
    role: "User & Site Custodian",
    icon: AlertTriangle,
    color: "text-amber-700 bg-amber-50 border-amber-200",
    description:
      "Upon returning the asset, a secondary post-use inspection is performed. Automated delta analysis compares baseline state against return condition. If wear, delays, or damage occurred, an incident ticket is flagged.",
    action: "Submit the return condition inspection and optionally flag a discrepancy to test dispute handling.",
  },
  {
    step: "06",
    title: "Incident Arbitration & Anti-Hoarding Oversight",
    role: "Organisation Manager (Vikram Malhotra)",
    icon: Scale,
    color: "text-purple-700 bg-purple-50 border-purple-200",
    description:
      "Platform managers arbitrate reported incidents, assess repair liability, and apply FairShare penalty dampening to prevent repeat negligence or resource monopolisation.",
    action: "Switch to Vikram Malhotra, enter Manager Operations, and resolve pending arbitration tickets.",
  },
  {
    step: "07",
    title: "Tamper-Evident Cryptographic Audit Ledger",
    role: "Platform Admin (Dhruv Jain)",
    icon: ShieldCheck,
    color: "text-rose-700 bg-rose-50 border-rose-200",
    description:
      "Every major platform event—including credential checks, approvals, physical check-ins, return reports, and arbitration decisions—is appended to an immutable, timestamped audit ledger.",
    action: "Switch to Dhruv Jain, view the live Platform Administration feed, and export the compliance bundle.",
  },
];

const ROLES = [
  {
    name: "Arjun Mehta",
    role: "Borrower (User)",
    org: "IIT / Horizon Hub",
    badge: "Student & Researcher",
    responsibilities: "Asset discovery, booking submissions, credential induction, pre/post inspection co-signing.",
  },
  {
    name: "Dr. Rajesh Rawal",
    role: "Resource Owner",
    org: "MIT Advanced Research Labs",
    badge: "Lab Custodian",
    responsibilities: "Equipment cataloging, safety tier assignment, usage rule definition, reservation approval.",
  },
  {
    name: "Vikram Malhotra",
    role: "Organisation Manager",
    org: "Horizon Business Hub",
    badge: "Risk & Operations Manager",
    responsibilities: "Facility oversight, FairShare anti-hoarding monitoring, incident dispute arbitration.",
  },
  {
    name: "Dhruv Jain",
    role: "Platform Administrator",
    org: "NEXUS Platform Federation",
    badge: "Root Governance",
    responsibilities: "Institutional accreditation, cryptographic audit trail verification, platform compliance.",
  },
];

const ADVANTAGES = [
  {
    title: "Algorithmic FairShare Policy",
    icon: Award,
    description:
      "Eliminates the 'first-come, first-served' hoarding problem. Priority is calculated using a transparent formula balancing monthly hours, urgency weight, and clean usage track records.",
  },
  {
    title: "3-Tier Safety Governance",
    icon: Layers,
    description:
      "Categorises equipment into Tier 1 (Open Access), Tier 2 (Certified Operator), and Tier 3 (Supervised Use Required), guaranteeing that hazardous or precision tools are never accessed without verified training.",
  },
  {
    title: "Immutable Chain of Custody",
    icon: Lock,
    description:
      "Every handoff is co-signed with dual-party condition checklists, photo records, and SHA-256 styled ledger entries to completely eliminate liability ambiguity.",
  },
  {
    title: "Zero Simulation / 100% Usable Prototype",
    icon: Sparkles,
    description:
      "Unlike mock screens or static prototypes, NEXUS runs on an active reactive state engine. Any booking, approval, or check-in immediately propagates across all 4 user perspectives in real-time.",
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-800">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* ── Top Header ───────────────────────────────────────────────────── */}
        <div className="mb-12 text-center sm:text-left border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            HACKATHON EVALUATION & USER GUIDE
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            How to Use NEXUS: Platform Guide
          </h1>
          <p className="text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            Welcome to the evaluation guide for NEXUS. This document details the complete end-to-end
            resource-sharing journey, multi-role testing guidelines, and core architectural advantages.
          </p>
        </div>

        {/* ── Section 1: The 7-Step Journey ─────────────────────────────────── */}
        <section className="mb-14">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#065f46] text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              The Complete 7-Step End-to-End Journey
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Judges can follow these exact steps to test the entire lifecycle from discovery to return:
            </p>
          </div>

          <div className="space-y-4">
            {STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        STEP {item.step}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border self-start ${item.color}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      Role: {item.role}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  <div className="bg-slate-50 border border-slate-100 rounded-lg px-3.5 py-2 text-xs text-slate-700 flex items-center gap-2 font-medium">
                    <span className="font-bold text-teal-800 flex-shrink-0">Action:</span>
                    <span>{item.action}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Section 2: Roles Summary ──────────────────────────────────────── */}
        <section className="mb-14">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#065f46] text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              Demo Personas & Role-Based Permissions (RBAC)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Switch between these 4 accounts using the floating widget in the bottom-right corner:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROLES.map((r) => (
              <div
                key={r.name}
                className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {r.badge}
                    </span>
                    <span className="text-[11px] font-bold text-teal-700 capitalize">{r.role}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{r.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{r.org}</p>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    <strong className="text-slate-800">Key Capabilities:</strong> {r.responsibilities}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Key Advantages ─────────────────────────────────────── */}
        <section className="mb-14">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#065f46] text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              Architectural Advantages & Innovations
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              How NEXUS addresses institutional hurdles and meets all hackathon judging criteria:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ADVANTAGES.map((adv) => {
              const Icon = adv.icon;
              return (
                <div
                  key={adv.title}
                  className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700 mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{adv.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{adv.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Section 4: Call to Action ─────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Ready to test the live platform?</h3>
            <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-xl">
              Open the Resource Catalog, use the bottom-right switcher to test different roles, and explore
              the complete resource-sharing workflow.
            </p>
          </div>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-teal-950 font-bold text-sm shadow hover:bg-slate-100 transition-all flex-shrink-0"
          >
            Launch Resource Catalog
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
