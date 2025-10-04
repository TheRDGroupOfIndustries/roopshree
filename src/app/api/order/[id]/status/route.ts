import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { Status } from "@/generated/prisma/client";

interface UpdateStatusBody {
  status: Status;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // get JWT token
    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateStatusBody = await req.json();
    const { status } = body;

    // fetch the order first
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // check permissions: ADMIN or seller of the order
    if (
      !payload.role.includes("ADMIN")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // update status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: { product: true, user: true },
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
