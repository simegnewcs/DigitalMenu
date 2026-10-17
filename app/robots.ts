import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://digitalmenu.devvoltz.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/menu/", "/menu/*"],
        disallow: ["/api/", "/dashboard/", "/dashboard/*", "/admin/"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/menu/", "/menu/*"],
        disallow: ["/api/", "/dashboard/", "/dashboard/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
