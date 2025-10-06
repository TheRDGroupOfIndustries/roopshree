import { authenticate } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Total expenses
    const totalExpenses = await prisma.expense.aggregate({
      _sum: { amount: true },
    });

    // 2. Category-wise breakdown
    const categoryBreakdown = await prisma.expense.groupBy({
      by: ["category"],
      _sum: { amount: true },
      orderBy: { category: "asc" },
    });

    // 3. Monthly breakdown (last 12 months)
    const monthlyBreakdown = await prisma.$queryRaw<
      { month: string; total: number }[]
    >`
      SELECT 
        to_char("date", 'YYYY-MM') as month, 
        SUM("amount") as total
      FROM "Expense"
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12;
    `;

    return NextResponse.json({
      total: totalExpenses._sum.amount || 0,
      category: categoryBreakdown.map((c: any) => ({
        category: c.category,
        total: c._sum.amount || 0,
      })),
      monthly: monthlyBreakdown,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
