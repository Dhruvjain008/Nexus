import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fbfbfa] flex items-center justify-center px-4 text-slate-800">
      <div className="text-center max-w-md bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 shadow-xs">
        <p className="text-xs font-bold text-teal-700 uppercase tracking-widest mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-lg shadow-xs transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
