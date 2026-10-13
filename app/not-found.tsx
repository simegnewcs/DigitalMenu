import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="DigitalMenu"
            width={64}
            height={64}
            className="w-16 h-16 object-contain rounded-2xl shadow-sm"
          />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">404 - Page Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The page or digital menu you are looking for does not exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
