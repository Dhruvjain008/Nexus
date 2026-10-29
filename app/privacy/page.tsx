import { Navbar } from "@/components/layout/Navbar";

export const metadata = {
  title: "Privacy Policy | NEXUS",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-800">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-slate-500">Last updated: 28 October 2026</p>
        </div>

        <div className="space-y-10 text-sm leading-7 text-slate-600 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xs">

          {/* 1. Introduction */}
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-3">1. Introduction</h2>
            <p>
              NEXUS is a resource-sharing platform that connects organisations, equipment owners, and users who need access to specialised equipment, spaces, and computing resources. This Privacy Policy describes how NEXUS (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, stores, and shares your personal information when you access or use the NEXUS platform.
            </p>
            <p className="mt-3">
              By creating an account or using the platform, you acknowledge that you have read and understood this policy. If you do not agree with any part of this policy, you should not use the platform.
            </p>
          </section>

          <div className="h-px bg-slate-200" />

          {/* 2. Information We Collect */}
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-3">2. Information We Collect</h2>
            <p>We collect the following categories of information:</p>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Account Data</h3>
                <p>
                  When you register, we collect your name, email address, affiliated organisation, department, and role. We may also collect credentials and certifications you provide to verify eligibility for specific resources.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Booking Records</h3>
                <p>
                  All booking requests, approvals, rejections, waitlist placements, and cancellations are recorded. This includes the resource requested, the intended purpose, requested time windows, and the outcome of eligibility and approval checks.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Condition Reports</h3>
                <p>
                  Pre-use and post-use condition reports, including checklist responses, notes, photographs, and AI-assisted analysis results, are stored and associated with the relevant booking and user account.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Usage Logs and Audit Events</h3>
                <p>
                  Platform activity, including login events, booking state transitions, condition report submissions, and administrative actions, is logged as part of our tamper-evident audit ledger. These logs include timestamps, the identity of the actor, and contextual details of each action.
                </p>
              </div>
            </div>
          </section>

          <div className="h-px bg-slate-200" />

          {/* 3. How We Use Your Information */}
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside marker:text-slate-400">
              <li>
                <span className="text-slate-900 font-semibold">Service operation:</span> To create and manage your account, process booking requests, enforce eligibility rules, and facilitate communication between users and resource owners.
              </li>
              <li>
                <span className="text-slate-900 font-semibold">Eligibility verification:</span> To check whether you hold the credentials, qualifications, or approvals required to access specific resources, and to update your trust and FairShare scores accordingly.
              </li>
              <li>
                <span className="text-slate-900 font-semibold">Audit and accountability:</span> To maintain an immutable record of all platform actions for dispute resolution, incident investigation, and compliance purposes.
              </li>
              <li>
                <span className="text-slate-900 font-semibold">Safety:</span> To detect, record, and respond to incidents involving damage, misuse, or safety violations, and to protect all parties using the platform.
              </li>
              <li>
                <span className="text-slate-900 font-semibold">Platform improvement:</span> To understand usage patterns and improve the reliability and usability of the platform. We do not use personal data for targeted advertising.
              </li>
            </ul>
          </section>

          <div className="h-px bg-slate-200" />

          {/* 4. Data Sharing */}
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-3">4. Data Sharing</h2>
            <p>
              We do not sell your personal data to third parties under any circumstances. We share your data only in the following limited contexts:
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Resource Owners</h3>
                <p>
                  When you submit a booking request, the resource owner receives your name, organisation, stated purpose, requested time window, credential status, and trust score. This is necessary to evaluate and respond to your request.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Managers and Administrators</h3>
                <p>
                  Platform managers and administrators may access booking records, condition reports, and audit logs for the purpose of reviewing incidents, resolving disputes, or maintaining platform integrity.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">Legal Obligations</h3>
                <p>
                  We may disclose your data if required to do so by applicable law, regulation, or a valid legal order from a court or regulatory authority.
                </p>
              </div>
            </div>
          </section>

          <div className="h-px bg-slate-200" />

          {/* 5. Data Retention */}
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-3">5. Data Retention</h2>
            <p>We retain your data for the following periods:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside marker:text-slate-400">
              <li>
                <span className="text-slate-900 font-semibold">Booking records and condition reports</span> are retained for three years from the date of the booking&apos;s completion or cancellation.
              </li>
              <li>
                <span className="text-slate-900 font-semibold">Audit log entries</span> are stored indefinitely as part of the tamper-evident ledger and cannot be deleted, modified, or anonymised without disrupting ledger integrity.
              </li>
              <li>
                <span className="text-slate-900 font-semibold">Account data</span> is retained for as long as your account is active. Upon verified deletion request, account data will be removed within 30 days, subject to the audit log exception described above.
              </li>
            </ul>
          </section>

          <div className="h-px bg-slate-200" />

          {/* 6. Your Rights */}
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-3">6. Your Rights</h2>
            <p>
              Depending on your jurisdiction, you may have the following rights with respect to your personal data:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside marker:text-slate-400">
              <li><span className="text-slate-900 font-semibold">Access:</span> Request a copy of the personal data we hold about you.</li>
              <li><span className="text-slate-900 font-semibold">Correction:</span> Request correction of inaccurate or incomplete data.</li>
              <li><span className="text-slate-900 font-semibold">Deletion:</span> Request deletion of your account and associated personal data, subject to audit log retention obligations.</li>
              <li><span className="text-slate-900 font-semibold">Export:</span> Request a machine-readable export of your data in a standard format.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:privacy@nexus.platform" className="text-teal-700 hover:text-teal-800 font-semibold transition-colors">
                privacy@nexus.platform
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <div className="h-px bg-slate-200" />

          {/* 7. Security */}
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-3">7. Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, disclosure, alteration, or destruction. These measures include:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside marker:text-slate-400">
              <li>Role-based access controls limiting data access to personnel with a legitimate need.</li>
              <li>Encrypted transmission of all data between your browser and our servers via TLS.</li>
              <li>Audit logging of all administrative and sensitive data operations.</li>
              <li>Regular review of access permissions and security configurations.</li>
            </ul>
            <p className="mt-3">
              No system can guarantee absolute security. If you believe your account has been compromised, contact us immediately at{" "}
              <a href="mailto:privacy@nexus.platform" className="text-teal-700 hover:text-teal-800 font-semibold transition-colors">
                privacy@nexus.platform
              </a>
              .
            </p>
          </section>

          <div className="h-px bg-slate-200" />

          {/* 8. Contact */}
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-3">8. Contact</h2>
            <p>
              If you have questions, concerns, or requests relating to this Privacy Policy or the handling of your personal data, you may contact our data privacy team at:
            </p>
            <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700">
              <a href="mailto:privacy@nexus.platform" className="text-teal-700 hover:text-teal-800 transition-colors font-semibold">
                privacy@nexus.platform
              </a>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
