import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/lib/jwt";

// GET stock by productId
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // <-- remove 'await' here

    const stock = await prisma.stock.findUnique({
      where: { productId: id },
      include: {
        history: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
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

// UPDATE stock manually (admin adjustment)
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { newStock } = await req.json();
    const { id } = await context.params;
    const user = await authenticate(req);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.stock.findUnique({
      where: { productId: id },
    });
    if (!existing)
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });

    if (newStock < 0) {
      return NextResponse.json(
        { error: "New stock cannot be negative" },
        { status: 400 }
      );
    }
    if (newStock === existing.currentStock) {
      return NextResponse.json(
        { error: "New stock is the same as the current stock" },
        { status: 400 }
      );
    }

    const updated = await prisma.stock.update({
      where: { productId: id },
      data: {
        currentStock: newStock,
        history: {
          create: {
            fromQuantity: existing.currentStock,
            toQuantity: newStock,
            updatedBy: user.userId,
          },
        },
      },
      include: { history: true },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// DELETE stock record
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await authenticate(req);
    if (!user || user.role !== "ADMIN") {
      NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const record = await prisma.stock.findUnique({ where: { productId: id } });
    if (!record) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }

    await prisma.stock.delete({ where: { productId: id } });
    return NextResponse.json({ message: "Stock deleted" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
