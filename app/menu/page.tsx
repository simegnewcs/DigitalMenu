import { Suspense } from "react";
import MenuPageClient from "./MenuPageClient";

export const metadata = {
  title: "Digital Restaurant Menu | DevVoltz",
  description:
    "Explore our interactive digital menu with live dish details, popular chef recommendations, table ordering tray, and instant search.",
};

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#011409] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#00E564] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-xs font-bold text-emerald-300 tracking-wide">Loading Menu...</p>
        </div>
      }
    >
      <MenuPageClient />
    </Suspense>
  );
}
