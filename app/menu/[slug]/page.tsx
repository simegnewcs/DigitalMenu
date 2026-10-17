import { Suspense } from "react";
import MenuSlugClient from "./MenuSlugClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const capitalized = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${capitalized} - Digital Menu | DevVoltz`,
    description: `Explore the full digital menu for ${capitalized} with dish pricing, photos, and live table ordering.`,
  };
}

export default async function PublicMenuSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#011409] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#00E564] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-xs font-bold text-emerald-300 tracking-wide">Loading Menu...</p>
        </div>
      }
    >
      <MenuSlugClient slug={slug} />
    </Suspense>
  );
}
