//Add Product to Wishlist
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
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

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: payload.userId,
          productId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Already in wishlist" }, { status: 200 });
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: payload.userId,
        productId,
      },
    });

    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Fetch User Wishlist
export async function GET() {
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

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: payload.userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(wishlist, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
