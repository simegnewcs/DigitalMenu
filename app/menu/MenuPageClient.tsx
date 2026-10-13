"use client";

import { useSearchParams } from "next/navigation";
import MenuView from "@/components/MenuView";

export default function MenuPageClient() {
  const searchParams = useSearchParams();
  const table = searchParams.get("table");
  const slug = searchParams.get("restaurant") || searchParams.get("slug") || undefined;

  return <MenuView slug={slug} tableNumber={table} />;
}
