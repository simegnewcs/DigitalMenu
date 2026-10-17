import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BGS_RESTAURANT_FALLBACK } from "@/lib/bgsMenuFallback";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

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

    if (restaurant) {
      return NextResponse.json(restaurant);
    }

    if (slug === "bgs-chicken-restaurant" || slug === "cmvc52i500003lb08vykm0x1v") {
      return NextResponse.json(BGS_RESTAURANT_FALLBACK);
    }

    return NextResponse.json(
      { error: "Restaurant not found" },
      { status: 404 }
    );
  } catch (error) {
    console.warn("Database lookup failed, checking fallback:", error);

    if (slug === "bgs-chicken-restaurant" || slug === "cmvc52i500003lb08vykm0x1v") {
      return NextResponse.json(BGS_RESTAURANT_FALLBACK);
    }

    return NextResponse.json(
      { error: "Failed to fetch menu", details: String(error) },
      { status: 500 }
    );
  }
}
