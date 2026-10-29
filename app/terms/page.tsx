import { Navbar } from "@/components/layout/Navbar";

export const metadata = {
  title: "Terms and Conditions | NEXUS",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-800">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Terms and Conditions of Use</h1>
          <p className="text-sm text-slate-500">Effective Date: 28 October 2026</p>
        </div>

        <div className="space-y-10 text-sm leading-7 text-slate-600 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xs">
          {/* 1. Introduction and Acceptance */}
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-3">1. Introduction & Acceptance</h2>
            <p>
              These Terms and Conditions govern your access to and use of the NEXUS platform. By registering an account, submitting a booking request, listing an institutional resource, or interacting with the network, you agree to comply with all operational guidelines and safety protocols set forth herein.
            </p>
          </section>

          <div className="h-px bg-slate-200" />

          {/* 2. Platform Nature and Authority */}
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-3">2. Platform Role</h2>
            <p>
              NEXUS facilitates trusted discovery, credential verification, and auditable custody tracking for institutional equipment and spaces. NEXUS is not the legal owner of listed items. Resource Owners retain absolute governance over access policies, reservation approvals, and site-specific safety regulations.
            </p>
          </section>

          <div className="h-px bg-slate-200" />

          {/* 3. Borrower Responsibilities */}
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-3">3. Borrower Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong className="text-slate-900 font-semibold">Credential Accuracy:</strong> You must provide legitimate, up-to-date certification records before requesting Tier 2 or Tier 3 hazardous or precision machinery.
              </li>
              <li>
                <strong className="text-slate-900 font-semibold">Mandatory Handover Inspection:</strong> You must physically inspect equipment alongside the site manager during check-in and co-sign the pre-use condition record.
              </li>
              <li>
                <strong className="text-slate-900 font-semibold">Authorized Usage Only:</strong> Resources may only be utilised for the declared research or technical purpose stated in your approved request.
              </li>
              <li>
                <strong className="text-slate-900 font-semibold">Punctual Return:</strong> Failure to initiate return procedures prior to expiration of your scheduled slot triggers automatic escalation and FairShare penalty point deductions.
              </li>
            </ul>
          </section>

          <div className="h-px bg-slate-200" />

          {/* 4. Owner & Manager Responsibilities */}
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-3">4. Owner & Custodian Responsibilities</h2>
            <p>
              Resource Owners agree to maintain listed equipment in nominal operating state, document known baseline cosmetic defects, provide necessary safety induction guidelines, and respond to reservation requests in an equitable, transparent timeframe.
            </p>
          </section>

          <div className="h-px bg-slate-200" />

          {/* 5. FairShare Policy & Anti-Monopolization */}
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-3">5. FairShare Policy & Anti-Hoarding</h2>
            <p>
              To maintain fair access across academic institutions, makerspaces, and research startups, NEXUS enforces algorithmic FairShare allocation. High-frequency reservation requests undergo dampening to prevent resource monopolisation. Priority placement in waitlists is determined through transparent mathematical criteria rather than arbitrary administrative preference.
            </p>
          </section>

          <div className="h-px bg-slate-200" />

          {/* 6. Incident Reporting & Damage Liability */}
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-3">6. Incident Reporting & Dispute Escalation</h2>
            <p>
              In the event of hardware malfunction, baseline discrepancy, or physical breakage, an incident ticket must be filed immediately. Automated AI inspection flags provide supplementary visual delta analysis; all liability determinations and remediation decisions remain subject to direct human manager arbitration.
            </p>
          </section>

          <div className="h-px bg-slate-200" />

          {/* 7. Auditable Ledger Integrity */}
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-3">7. Tamper-Evident Audit Logging</h2>
            <p>
              All key transaction checkpoints—including credential validation, approvals, check-ins, returns, and dispute resolutions—are permanently appended to an auditable ledger. Records cannot be silently altered or expunged by either party.
            </p>
          </section>

          <div className="h-px bg-slate-200" />

          {/* 8. Contact */}
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-3">8. Governance & Inquiries</h2>
            <p>
              For questions regarding platform policy, safety standards, or institutional onboarding, contact{" "}
              <span className="text-teal-700 font-mono font-semibold">governance@nexus.platform</span>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
