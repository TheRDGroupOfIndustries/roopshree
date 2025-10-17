import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { Status } from "@prisma/client";


export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Soft delete by setting status to CANCELLED
    if (payload.role.includes("ADMIN")) {
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      const cancelledOrder = await prisma.order.update({
        where: { id },
        data: { status: Status.CANCELLED },
      });
      await prisma.stock.update({
        where: { productId: order.productId },
        data: {
          currentStock: { increment: order.quantity },
        },
      });

      return NextResponse.json(cancelledOrder);
    }

    //user cancle own order
    if (payload.role.includes("USER")) {
      // Fetch the order first
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Only allow if the user owns the order
      if (order.userId !== payload.userId) {
        return NextResponse.json({ error: "id issue" }, { status: 403 });
      }

      const cancelledOrder = await prisma.order.update({
        where: { id },
        data: { status: Status.CANCELLED },
      });

      await prisma.stock.update({
        where: { productId: order.productId },
        data: {
          currentStock: { increment: order.quantity },
        },
      });

      return NextResponse.json(cancelledOrder);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
