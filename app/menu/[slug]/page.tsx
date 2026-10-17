import { Suspense } from "react";
import type { Metadata } from "next";
import MenuSlugClient from "./MenuSlugClient";
import { prisma } from "@/lib/prisma";
import { BGS_RESTAURANT_FALLBACK } from "@/lib/bgsMenuFallback";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://digitalmenu.devvoltz.com";

async function getRestaurantData(slug: string) {
  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        isActive: true,
      },
      include: {
        categories: {
          orderBy: { sortOrder: "asc" },
          include: {
            menuItems: {
              where: { isAvailable: true },
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
    });

    if (restaurant) return restaurant;
    if (slug === "bgs-chicken-restaurant" || slug === "cmvc52i500003lb08vykm0x1v") {
      return BGS_RESTAURANT_FALLBACK;
    }
    return null;
  } catch (e) {
    if (slug === "bgs-chicken-restaurant" || slug === "cmvc52i500003lb08vykm0x1v") {
      return BGS_RESTAURANT_FALLBACK;
    }
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getRestaurantData(slug);

  const name = restaurant?.name || slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const address = restaurant?.address || "5Kilo, Addis Ababa";
  const pageUrl = `${siteUrl}/menu/${slug}`;
  const totalDishes = restaurant?.categories ? restaurant.categories.reduce((a, c) => a + c.menuItems.length, 0) : 49;

  const title = `${name} — Digital Menu & Contactless Table Ordering | ${address}`;
  const description = `Explore the official digital menu for ${name} in ${address}. Browse ${totalDishes} dishes with live ETB prices, dish photos, special shawarma & chicken platters, and install the app for 1-tap table dining.`;
  const heroImage = `${siteUrl}/dishes/shawarma.jpg`;

  return {
    title,
    description,
    keywords: [
      name,
      `${name} menu`,
      `${name} prices`,
      `${name} delivery`,
      "Chicken Shawarma Addis Ababa",
      "5Kilo Restaurants",
      "Ethiopian digital menu",
      "Contactless dining Addis Ababa",
      "Telebirr restaurant ordering",
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "DigitalMenu",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: `${name} Featured Menu Dishes`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [heroImage],
      creator: "@devvoltz",
    },
    other: {
      "restaurant:contact_address": address,
      "price:currency": "ETB",
    },
  };
}

export default async function PublicMenuSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const restaurant = await getRestaurantData(slug);

  // Generate Restaurant Schema.org JSON-LD
  const restaurantName = restaurant?.name || "BGS Chicken Restaurant";
  const restaurantAddress = restaurant?.address || "5Kilo, Addis Ababa";
  const pageUrl = `${siteUrl}/menu/${slug}`;

  const jsonLdRestaurant = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Restaurant", "FoodEstablishment"],
        "@id": `${pageUrl}/#restaurant`,
        name: restaurantName,
        url: pageUrl,
        image: [
          `${siteUrl}/dishes/shawarma.jpg`,
          `${siteUrl}/dishes/roasted_chicken.jpg`,
        ],
        telephone: restaurant?.phone || "+251911000000",
        priceRange: "ETB 20 - 2,900",
        servesCuisine: [
          "Chicken",
          "Shawarma",
          "Fast Food",
          "Ethiopian",
          "Halal",
          "Mocktails",
          "Fresh Juices",
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: restaurantAddress,
          addressLocality: "Addis Ababa",
          addressRegion: "Addis Ababa",
          addressCountry: "ET",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "9.0435",
          longitude: "38.7618",
        },
        currenciesAccepted: "ETB",
        paymentAccepted: "Cash, Telebirr, Mobile Banking",
        hasMenu: {
          "@type": "Menu",
          name: `${restaurantName} Full Digital Menu`,
          url: pageUrl,
          hasMenuItemList: (restaurant?.categories || []).map((cat) => ({
            "@type": "ItemList",
            name: cat.name,
            description: cat.description,
            numberOfItems: cat.menuItems.length,
            itemListElement: cat.menuItems.map((item, idx) => ({
              "@type": "MenuItem",
              position: idx + 1,
              name: item.name,
              description: item.description || undefined,
              offers: {
                "@type": "Offer",
                price: item.price,
                priceCurrency: "ETB",
                availability: item.isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              },
              image: item.image || undefined,
            })),
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Menus",
            item: `${siteUrl}/menu`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: restaurantName,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdRestaurant) }}
      />

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
    </>
  );
}
