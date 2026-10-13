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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <MenuSlugClient slug={slug} />
    </Suspense>
  );
}
