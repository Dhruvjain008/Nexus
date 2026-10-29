"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import {
  ClipboardList,
  Search,
  CheckCircle2,
  BarChart3,
  FlaskConical,
  Wrench,
  Building2,
  ArrowRight,
  Shield,
  Scale,
  BookOpen,
} from "lucide-react";
import gsap from "gsap";

// ─── NexusLogo (standalone for footer) ───────────────────────────────────────
function NexusLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="7" fill="#0f172a" />
        <path d="M8 22 L8 10 L14 18 L14 10" stroke="#14b8a6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 10 L20 18 L20 10" stroke="#14b8a6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="16" r="2.5" fill="#10b981" />
      </svg>
      <span className="text-[15px] font-bold tracking-tight text-slate-900">NEXUS</span>
    </Link>
  );
}

// ─── Step card ────────────────────────────────────────────────────────────────
interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}
function StepCard({ number, title, description, icon }: StepCardProps) {
  return (
    <div className="flex flex-col gap-4 p-5 bg-white border border-slate-200/90 rounded-xl shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700 flex-shrink-0">
          {icon}
        </div>
        <span className="text-xs font-mono text-teal-700 font-semibold tracking-widest">STEP {number}</span>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 tracking-tight mb-1">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-white border border-slate-200/90 rounded-xl shadow-xs">
      <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 tracking-tight mb-2">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ─── Category card ────────────────────────────────────────────────────────────
interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}
function CategoryCard({ icon, title, description, href }: CategoryCardProps) {
  return (
    <div className="group flex flex-col gap-4 p-6 bg-white border border-slate-200/90 rounded-xl shadow-xs hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
        {icon}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-slate-900 tracking-tight">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
      <Link
        href={href}
        className="mt-auto inline-flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-800 transition-colors font-semibold"
      >
        Browse category
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from(".hero-animate", {
        opacity: 0,
        y: 22,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        delay: 0.1,
      });

      // Steps
      gsap.from(".step-animate", {
        opacity: 0,
        y: 18,
        duration: 0.55,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.3,
      });

      // Features
      gsap.from(".feature-animate", {
        opacity: 0,
        y: 18,
        duration: 0.55,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.45,
      });

      // Categories
      gsap.from(".category-animate", {
        opacity: 0,
        y: 18,
        duration: 0.55,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.6,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-800">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden px-4 sm:px-6 pt-24 pb-28 md:pt-32 md:pb-36"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 20%, rgba(13, 148, 136, 0.06) 0%, transparent 65%), repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(15, 23, 42, 0.035) 39px, rgba(15, 23, 42, 0.035) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(15, 23, 42, 0.035) 39px, rgba(15, 23, 42, 0.035) 40px)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          {/* label */}
          <div className="hero-animate inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 border border-emerald-200/90 rounded-full text-xs font-semibold text-emerald-800 tracking-wider shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            TRUSTED RESOURCE SHARING NETWORK
          </div>

          {/* headline */}
          <h1 className="hero-animate text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#064e3b] leading-[1.15]">
            Institutional resources,{" "}
            <span className="text-[#065f46]">open to those who need them.</span>
          </h1>

          {/* subtext */}
          <p className="hero-animate text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            NEXUS connects verified users with underused lab equipment, spaces, and tools through a
            structured approval and accountability workflow.
          </p>

          {/* CTA buttons */}
          <div className="hero-animate flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/resources"
              className="inline-flex items-center justify-center gap-2 bg-[#065f46] hover:bg-[#064e3b] text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
            >
              Browse Resources
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-semibold px-5 py-2.5 rounded-lg shadow-xs hover:shadow-sm transition-all"
            >
              List a Resource
            </Link>
          </div>

          {/* trust line */}
          <p className="hero-animate text-xs text-slate-500 tracking-wide">
            Used by researchers, students, startups and makerspaces
          </p>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section ref={stepsRef} className="px-4 sm:px-6 py-20 max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-mono text-teal-700 tracking-widest uppercase mb-2 font-semibold">
            Process
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            How it works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="step-animate">
            <StepCard
              number="01"
              title="List"
              description="The resource owner lists equipment or space with conditions, eligibility requirements, and availability windows."
              icon={<ClipboardList className="w-4 h-4" />}
            />
          </div>
          <div className="step-animate">
            <StepCard
              number="02"
              title="Discover"
              description="Users search and filter available resources by category, safety tier, location, and real-time availability."
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="step-animate">
            <StepCard
              number="03"
              title="Verify and Book"
              description="Eligibility is checked against owner criteria. Requests enter an approval queue with full context for the owner to decide."
              icon={<CheckCircle2 className="w-4 h-4" />}
            />
          </div>
          <div className="step-animate">
            <StepCard
              number="04"
              title="Track"
              description="Check-in, use, and return are logged with condition reports. Every event is written to a tamper-evident audit ledger."
              icon={<BarChart3 className="w-4 h-4" />}
            />
          </div>
        </div>
      </section>

      {/* ── What makes NEXUS different ────────────────────────────────────── */}
      <section ref={featuresRef} className="px-4 sm:px-6 py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-mono text-teal-700 tracking-widest uppercase mb-2 font-semibold">
              Platform principles
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              What makes NEXUS different
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="feature-animate">
              <FeatureCard
                icon={<Scale className="w-5 h-5" />}
                title="FairShare Allocation"
                description="A transparent priority scoring system prevents any user from monopolising limited resources. Every placement decision is explained with a visible score breakdown."
              />
            </div>
            <div className="feature-animate">
              <FeatureCard
                icon={<Shield className="w-5 h-5" />}
                title="Condition Accountability"
                description="Before and after condition reports with photo documentation and an AI-assisted discrepancy check. Final decisions on incidents stay with the resource owner."
              />
            </div>
            <div className="feature-animate">
              <FeatureCard
                icon={<BookOpen className="w-5 h-5" />}
                title="Auditable History"
                description="Every approval, rejection, check-in, return, and incident is recorded in a tamper-evident ledger accessible to authorised parties at any time."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Resource categories ───────────────────────────────────────────── */}
      <section ref={categoriesRef} className="px-4 sm:px-6 py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-mono text-teal-700 tracking-widest uppercase mb-2 font-semibold">
              Categories
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              What you can find on NEXUS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="category-animate">
              <CategoryCard
                icon={<FlaskConical className="w-5 h-5" />}
                title="Lab Equipment"
                description="Analytical instruments, spectrometers, centrifuges, microscopes, and precision measurement tools from institutional labs."
                href="/resources?category=lab-equipment"
              />
            </div>
            <div className="category-animate">
              <CategoryCard
                icon={<Wrench className="w-5 h-5" />}
                title="Fabrication Tools"
                description="3D printers, laser cutters, CNC machines, electronics workstations, and prototyping equipment from shared makerspaces."
                href="/resources?category=fabrication"
              />
            </div>
            <div className="category-animate">
              <CategoryCard
                icon={<Building2 className="w-5 h-5" />}
                title="Professional Spaces"
                description="Meeting rooms, recording studios, clean rooms, wet labs, and project workspaces bookable through a unified scheduling interface."
                href="/resources?category=spaces"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white px-4 sm:px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <NexusLogo />
            <p className="text-xs text-slate-500 pl-0.5">
              Structured resource sharing for institutions and communities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-4">
              <Link
                href="/guide"
                className="text-xs font-bold text-teal-800 hover:text-teal-950 transition-colors"
              >
                How to Use
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                Terms
              </Link>
            </div>
            <p className="text-xs text-slate-400">Built for Code Conquer Hackathon 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
