import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

interface AssignDeliveryBody {
  deliveryBoyId: string;
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Authenticate admin
    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (!payload.role.includes("ADMIN")) {
      return NextResponse.json(
        { error: "Forbidden: Admin only" },
        { status: 403 }
      );
    }

    const body: AssignDeliveryBody = await req.json();
    const { deliveryBoyId } = body;

    if (!deliveryBoyId) {
      return NextResponse.json(
        { error: "deliveryBoyId is required" },
        { status: 400 }
      );
    }

    // Check if order exists
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if delivery boy exists and has DELIVERY_BOY role
    const deliveryBoy = await prisma.user.findUnique({
      where: { id: deliveryBoyId },
    });
    if (!deliveryBoy) {
      return NextResponse.json(
        { error: "Delivery boy not found" },
        { status: 404 }
      );
    }
    if (!deliveryBoy.role.includes("DELIVERY_BOY")) {
      return NextResponse.json(
        { error: "User is not a delivery boy" },
        { status: 400 }
      );
    }

    // Assign delivery boy to order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { deliveryBoyId },
      include: { product: true, user: true, deliveryBoy: true },
    });

    const safeOrder = {
      ...updatedOrder,
      user: updatedOrder.user
        ? { ...updatedOrder.user, password: undefined }
        : undefined,
      deliveryBoy: updatedOrder.deliveryBoy
        ? { ...updatedOrder.deliveryBoy, password: undefined }
        : undefined,
    };

    return NextResponse.json(safeOrder, { status: 200 });
  } catch (error: any) {
    console.error("assign-delivery error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
