import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { Status } from "@/generated/prisma/client";

//create order
interface Order {
  productId: string;
  quantity: number;
  totalAmount: number;
  address: string;
  paymentMode?: string;
  status?: Status;
  referralCode?: string;
}
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestCookies = cookies();
    const body = (await req.json()) as Order;
    const token = (await requestCookies).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const {
      quantity,
      totalAmount,
      status,
      address,
      paymentMode,
      referralCode,
    } = body;

    const userId = payload.userId.toString();
    const order = await prisma.order.create({
      data: {
        productId: id,
        userId,
        quantity,
        totalAmount,
        status,
        address,
        paymentMode,
        referralCode,
      },
    });

    // Update stock on order
    await prisma.stock.update({
      where: { productId: id },
      data: {
        currentStock: { decrement: quantity },
      },
    });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//Delete order
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyJwt(token);
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
