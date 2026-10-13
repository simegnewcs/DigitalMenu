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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <MenuPageClient />
    </Suspense>
  );
}
