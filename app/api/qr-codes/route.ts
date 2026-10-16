import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import QRCode from "qrcode";
import { generateQRCodeUrl } from "@/lib/utils";

// GET QR codes for a restaurant
export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json(
        { error: "Restaurant ID required" },
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    if (session.user.role !== "ADMIN" && restaurant.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const qrCodes = await prisma.qRCode.findMany({
      where: { restaurantId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(qrCodes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch QR codes" },
      { status: 500 }
    );
  }
}

// POST generate QR code
export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { restaurantId, tableNumber } = body;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    if (session.user.role !== "ADMIN" && restaurant.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Business owners must pay 1300 ETB via Telebirr (0962935163) before generating QR codes
    if (session.user.role !== "ADMIN" && !restaurant.isQrPaid) {
      return NextResponse.json(
        {
          error: "Payment required: Business owners must pay 1,300 ETB via Telebirr (0962935163) to generate and download QR codes.",
          requiresPayment: true,
          amount: 1300,
          currency: "ETB",
          paymentMethod: "TELEBIRR",
          phoneNumber: "0962935163",
        },
        { status: 402 }
      );
    }

    // Generate unique code
    const code = tableNumber 
      ? `${restaurant.slug}-table-${tableNumber}-${Date.now()}`
      : `${restaurant.slug}-${Date.now()}`;

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
    const currentOrigin = host ? `${protocol}://${host}` : undefined;
    const menuUrl = generateQRCodeUrl(restaurant.slug, tableNumber, currentOrigin);
    
    // Generate QR code as data URL
    const qrImageUrl = await QRCode.toDataURL(menuUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    const qrCode = await prisma.qRCode.create({
      data: {
        code,
        restaurantId,
        tableNumber,
        qrImageUrl,
      },
    });

    return NextResponse.json({ ...qrCode, menuUrl }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
