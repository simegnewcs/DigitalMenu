import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://digitalmenu.devvoltz.com";
  const now = new Date();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/menu/bgs-chicken-restaurant`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const dynamicRestaurantRoutes: MetadataRoute.Sitemap = restaurants
      .filter((r) => r.slug !== "bgs-chicken-restaurant") // already in static
      .map((r) => ({
        url: `${baseUrl}/menu/${r.slug}`,
        lastModified: r.updatedAt || now,
        changeFrequency: "daily",
        priority: 0.85,
      }));

    return [...staticRoutes, ...dynamicRestaurantRoutes];
  } catch (error) {
    // Resilient fallback if DB connection times out
    return staticRoutes;
  }
}
