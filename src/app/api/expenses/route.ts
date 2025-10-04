import { authenticate } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, category, amount } = body;

    const expense = await prisma.expense.create({
      data: {
        title,
        description,
        category,
        amount: parseFloat(amount),
        createdBy: user.userId,
      },
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
    console.error("Error creating expense:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create expense" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expenses = await prisma.expense.findMany({
      orderBy: { date: "desc" },
      select: {
        id: true,
        title: true,
        category: true,
        amount: true,
        date: true,
        createdBy: true,
      },
    });

    return NextResponse.json(expenses);
  } catch (err: any) {
    console.error("Error fetching expenses:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}
