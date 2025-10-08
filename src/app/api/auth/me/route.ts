import { authenticate } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userDetails = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
        orders: true,
        address: true,
        wishlist: true,
        cart: {
          select: {
            items: true,
          },
        },
      },
    });

    const safeUserDetails = {
      ...userDetails,
      password: undefined,
    };
    return NextResponse.json(safeUserDetails);
  } catch (error: any) {
    console.error("Error fetching User Detaails: ", error);
    return NextResponse.json(
      {
        error: error.message || "Error fetching User Detaails",
      },
      { status: 500 }
    );
  }
}
