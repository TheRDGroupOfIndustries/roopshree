import { authenticate } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query: Get month + category-wise breakdown
    const monthlyCategoryBreakdown = await prisma.$queryRaw<
      { month: string; category: string; total: number }[]
    >`
      SELECT 
        to_char("date", 'YYYY-MM') as month,
        "category",
        SUM("amount") as total
      FROM "Expense"
      GROUP BY month, "category"
      ORDER BY month DESC;
    `;

    // Transform to nested structure
    const monthlyData = monthlyCategoryBreakdown.reduce((acc, row) => {
      const existingMonth = acc.find((m: any) => m.month === row.month);

      if (existingMonth) {
        existingMonth.category.push({
          category: row.category,
          total: Number(row.total),
        });
        existingMonth.total += Number(row.total);
      } else {
        acc.push({
          month: row.month,
          total: Number(row.total),
          category: [
            {
              category: row.category,
              total: Number(row.total),
            },
          ],
        });
      }

      return acc;
    }, [] as any[]);

    return NextResponse.json(monthlyData);
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json(
      { error: "Failed to fetch monthly analytics" },
      { status: 500 }
    );
  }
}
