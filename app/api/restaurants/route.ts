import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { generateSlug } from "@/lib/utils";

// GET all restaurants
export async function GET() {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let restaurants;
    
    if (session.user.role === "ADMIN") {
      restaurants = await prisma.restaurant.findMany({
        include: { owner: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      });
    } else {
      restaurants = await prisma.restaurant.findMany({
        where: { ownerId: session.user.id },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(restaurants);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}

// POST create new restaurant
export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, address, phone, description, logo } = body;

    let slug = generateSlug(name);
    let slugExists = await prisma.restaurant.findUnique({ where: { slug } });
    let counter = 1;

    while (slugExists) {
      slug = `${generateSlug(name)}-${counter}`;
      slugExists = await prisma.restaurant.findUnique({ where: { slug } });
      counter++;
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        slug,
        address,
        phone,
        description,
        logo,
        ownerId: session.user.id,
      },
    });

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create restaurant" },
      { status: 500 }
    );
  }
}
