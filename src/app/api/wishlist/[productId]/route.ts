import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

type Params = { params: { productId: string } };

// Remove from Wishlist
export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { productId } = params;

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId: payload.userId,
          productId,
        },
      },
    });
    
    return NextResponse.json({ message: "Removed from wishlist" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
