import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DigitalMenu — Smart QR Dining & Mobile Food Menu",
    short_name: "DigitalMenu",
    description: "Browse dishes, order from your table, and enjoy contactless dining at BGS Chicken Restaurant & partner venues.",
    start_url: "/menu/bgs-chicken-restaurant",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#011409",
    theme_color: "#00E564",
    categories: ["food", "restaurants", "shopping", "lifestyle"],
    lang: "en",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "BGS Chicken Menu",
        short_name: "BGS Menu",
        description: "Open BGS Chicken Restaurant digital menu",
        url: "/menu/bgs-chicken-restaurant",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Browse Restaurants",
        short_name: "Restaurants",
        description: "Explore all digital dining menus",
        url: "/",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
