import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyJwt(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userDetails = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
        orders: true,
        address: true,
        wishlist: true,
        cart: { select: { items: true } },
      },
    });

    return NextResponse.json(userDetails);
  } catch (error: any) {
    console.error("Error fetching User Details: ", error);
    return NextResponse.json({ error: error.message || "Error fetching User Details" }, { status: 500 });
  }
}
