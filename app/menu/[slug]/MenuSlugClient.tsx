"use client";

import { useSearchParams } from "next/navigation";
import MenuView from "@/components/MenuView";

export default function MenuSlugClient({
  slug,
  initialRestaurant,
}: {
  slug: string;
  initialRestaurant?: any;
}) {
  const searchParams = useSearchParams();
  const table = searchParams.get("table");

  return <MenuView slug={slug} tableNumber={table} initialRestaurant={initialRestaurant} />;
}
