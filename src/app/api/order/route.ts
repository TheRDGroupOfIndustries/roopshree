import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { Status } from "@/generated/prisma/client";


//all order
export async function GET() {
  try {
    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (payload.role.includes("ADMIN")) {
      const orders = await prisma.order.findMany({orderBy: { createdAt: "desc" }, include: {
    product: true,
    user: true,
  },});
      return NextResponse.json(orders);
        
    }

    const userId = payload.userId.toString();
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      }, orderBy: { createdAt: "desc" }, include: {
    product: true,
    user: true,
  },
    });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

