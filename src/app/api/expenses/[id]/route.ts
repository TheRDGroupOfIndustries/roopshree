import { authenticate } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, category, amount } = body;

    const expense = await prisma.expense.update({
      where: { id },
      data: { title, description, category, amount: parseFloat(amount) },
      select: {
        id: true,
        title: true,
        category: true,
        amount: true,
        date: true,
      },
    });

    return NextResponse.json(expense);
  } catch (err: any) {
    console.error("Error updating expense:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const user = await authenticate(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.expense.delete({ where: { id } });
    return NextResponse.json({ message: "Expense deleted successfully", id });
  } catch (err: any) {
    console.error("Error deleting expense:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete expense" },
      { status: 500 }
    );
  }
}
