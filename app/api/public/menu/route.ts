import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    // Fetch all active restaurants for quick switcher / directory
    const allRestaurants = await prisma.restaurant.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        description: true,
        address: true,
        phone: true,
        _count: {
          select: {
            categories: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (allRestaurants.length === 0) {
      return NextResponse.json({
        restaurants: [],
        currentRestaurant: null,
      });
    }

    // Default to provided slug or first available restaurant
    const targetSlug = slug || allRestaurants[0].slug;

    const currentRestaurant = await prisma.restaurant.findFirst({
      where: { slug: targetSlug, isActive: true },
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

    return NextResponse.json({
      restaurants: allRestaurants,
      currentRestaurant: currentRestaurant || (allRestaurants.length > 0 ? null : null),
    });
  } catch (error) {
    console.error("Public menu error:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}
