"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import {
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Sparkles,
} from "lucide-react";

interface ConditionReportFormProps {
  phase: "CHECK_IN" | "RETURN";
  bookingId: string;
  onComplete: () => void;
  className?: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export function ConditionReportForm({
  phase,
  bookingId,
  onComplete,
  className,
}: ConditionReportFormProps) {
  const isCheckIn = phase === "CHECK_IN";

  const defaultItems: ChecklistItem[] = isCheckIn
    ? [
        { id: "c1", label: "Equipment is clean and free of visible contamination or foreign debris", checked: true },
        { id: "c2", label: "All listed accessories, safety enclosures, and cabling are present", checked: true },
        { id: "c3", label: "No baseline structural damage, cracked housing, or loose mounts detected", checked: true },
        { id: "c4", label: "Emergency shut-offs and status indicators power on correctly", checked: true },
      ]
    : [
        { id: "r1", label: "Item wiped down and returned in sanitised operating state", checked: true },
        { id: "r2", label: "All original attachments, bits, and adapters placed in docking stations", checked: true },
        { id: "r3", label: "No new physical defects, cracks, or burnt components during runtime", checked: true },
        { id: "r4", label: "Operating log filled with actual cycle run hours", checked: true },
      ];

  const [items, setItems] = useState<ChecklistItem[]>(defaultItems);
  const [notes, setNotes] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [signedByUser, setSignedByUser] = useState(false);
  const [signedByOwner, setSignedByOwner] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleSimulateUpload = () => {
    setHasPhoto(true);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiReport(
        isCheckIn
          ? "AI Vision scan verified: Optical surface clean. Calibration seals intact. Baseline recorded."
          : "AI Vision delta inspection: Matches check-in baseline. 0 surface anomalies detected."
      );
    }, 1200);
  };

  const allItemsChecked = items.every((i) => i.checked);
  const canSubmit = signedByUser && signedByOwner && allItemsChecked;

  return (
    <div className={cn("bg-white border border-slate-200/90 rounded-xl p-5 space-y-6 shadow-xs", className)}>
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-teal-700" />
            {isCheckIn ? "Pre-Use Handover Inspection" : "Post-Use Return Verification"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Both borrower and verified manager must inspect the hardware before signing.
          </p>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          Ref: {bookingId}
        </span>
      </div>

      {/* Checklist */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Physical Inspection Points
        </label>
        <div className="space-y-2">
          {items.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-lg border text-left text-xs transition-colors shadow-2xs font-medium",
                item.checked
                  ? "bg-slate-50 border-slate-200 text-slate-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded mt-0.5 flex items-center justify-center flex-shrink-0 border",
                  item.checked
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-rose-50 border-rose-300 text-rose-700"
                )}
              >
                {item.checked ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              </div>
              <span className="leading-relaxed">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Photo upload simulated with instant preview */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Photographic Evidence Record
        </label>
        {!hasPhoto ? (
          <button
            type="button"
            onClick={handleSimulateUpload}
            className="w-full border border-dashed border-slate-300 hover:border-teal-600 rounded-lg p-6 flex flex-col items-center justify-center gap-2 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-teal-700 transition-colors" />
            <span className="text-xs font-semibold text-slate-700">
              Click to capture or attach high-resolution photo evidence
            </span>
            <span className="text-[11px] text-slate-400">Simulates automatic AI baseline verification</span>
          </button>
        ) : (
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-xs font-mono font-bold text-slate-600">
                IMG
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {isCheckIn ? "pre_use_baseline_01.jpg" : "post_return_telemetry_02.jpg"}
                </p>
                <p className="text-[11px] text-slate-500">2.4 MB · Cryptographic timestamp verified</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setHasPhoto(false);
                setAiReport(null);
              }}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              Replace
            </button>
          </div>
        )}

        {/* AI Inspection Box */}
        {isAnalyzing && (
          <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
            <div className="w-3.5 h-3.5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
            Analyzing photographic telemetry for micro-scratches and thermal stress...
          </div>
        )}
        {aiReport && !isAnalyzing && (
          <div className="flex items-start gap-2.5 p-3.5 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900">
            <Sparkles className="w-4 h-4 text-teal-700 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-teal-900">Automated Visual Telemetry</p>
              <p className="text-teal-800 mt-0.5 leading-relaxed">{aiReport}</p>
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      <Textarea
        label="Inspection Notes (Optional)"
        placeholder="Document any minor cosmetics, existing paint wear, or runtime telemetry..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
      />

      {/* Dual sign-off */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Dual Accountability Sign-Off
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            type="button"
            variant={signedByUser ? "secondary" : "outline"}
            onClick={() => setSignedByUser(!signedByUser)}
            className={cn(
              "text-xs justify-start h-10 font-semibold shadow-xs",
              signedByUser
                ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                : "border-slate-300 bg-white text-slate-700"
            )}
          >
            <ShieldCheck className={cn("w-4 h-4 mr-1", signedByUser ? "text-emerald-700" : "text-slate-400")} />
            {signedByUser ? "Borrower Signed" : "Sign as Borrower"}
          </Button>

          <Button
            type="button"
            variant={signedByOwner ? "secondary" : "outline"}
            onClick={() => setSignedByOwner(!signedByOwner)}
            className={cn(
              "text-xs justify-start h-10 font-semibold shadow-xs",
              signedByOwner
                ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                : "border-slate-300 bg-white text-slate-700"
            )}
          >
            <ShieldCheck className={cn("w-4 h-4 mr-1", signedByOwner ? "text-emerald-700" : "text-slate-400")} />
            {signedByOwner ? "Custodian Signed" : "Counter-sign as Custodian"}
          </Button>
        </div>
        <p className="text-[11px] text-slate-500">
          Both digital signatures are hashed and permanently committed to the immutable audit ledger.
        </p>
      </div>

      {/* Submit button */}
      <Button
        type="button"
        variant="primary"
        className="w-full font-bold shadow-sm"
        disabled={!canSubmit}
        onClick={onComplete}
      >
        Complete & Seal Condition Report
      </Button>
    </div>
  );
}
