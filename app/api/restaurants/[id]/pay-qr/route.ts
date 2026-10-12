import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
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

    const body = await request.json();
    const { transactionRef, phoneNumber } = body;

    if (!transactionRef || typeof transactionRef !== "string" || transactionRef.trim().length === 0) {
      return NextResponse.json(
        { error: "Telebirr transaction reference is required" },
        { status: 400 }
      );
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        isQrPaid: true,
        qrPaymentRef: transactionRef.trim(),
        qrPaymentPhone: phoneNumber ? String(phoneNumber).trim() : "0962935163",
        qrPaidAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment confirmed! QR code generation is now unlocked.",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    console.error("Pay QR error:", error);
    return NextResponse.json(
      { error: "Failed to process payment confirmation" },
      { status: 500 }
    );
  }
}

// Admin can toggle payment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { isQrPaid } = body;

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        isQrPaid: Boolean(isQrPaid),
        qrPaidAt: isQrPaid ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}
