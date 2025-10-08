import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/lib/jwt";

// GET all stocks
export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user || user.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const stocks = await prisma.stock.findMany({
      include: {
        product: true,
        history: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return NextResponse.json(stocks);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// CREATE stock entry for a product
export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, initialStock } = await req.json();
    const existing = await prisma.stock.findUnique({ where: { productId } });
    if (existing)
      return NextResponse.json(
        { error: "Stock already exists" },
        { status: 400 }
      );

    const stock = await prisma.stock.create({
      data: {
        productId,
        currentStock: initialStock,
        history: {
          create: {
            fromQuantity: 0,
            toQuantity: initialStock,
            updatedBy: user.userId,
          },
        },
      },
      include: { history: true },
    });

    return NextResponse.json(stock);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
