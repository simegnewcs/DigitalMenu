import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug, isActive: true },
      include: {
        categories: {
          include: {
            menuItems: {
              where: {
                isAvailable: true,
                OR: [
                  { name: { contains: query } },
                  { description: { contains: query } },
                ],
              },
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Filter out categories with no matching items
    const filteredCategories = restaurant.categories.filter(
      (cat) => cat.menuItems.length > 0
    );

    return NextResponse.json({
      ...restaurant,
      categories: filteredCategories,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search menu" },
      { status: 500 }
    );
  }
}
