import { authenticate } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current month range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // --- 1️⃣ Total Sales (This Month) ---
    const totalSalesThisMonth = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: {
          not: "CANCELLED", // exclude cancelled orders
          equals: "DELIVERED"
        },
      },
    });

    // --- 2️⃣ New Orders (This Month) ---
    const newOrdersThisMonth = await prisma.order.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // --- 3️⃣ Active Products (All Time) ---
    const activeProducts = await prisma.products.count();

    // --- 4️⃣ New Users (This Month) ---
    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // ✅ Combine all results
    const summary = {
      totalSales: totalSalesThisMonth._sum.totalAmount || 0,
      newOrders: newOrdersThisMonth,
      activeProducts,
      newUsers: newUsersThisMonth,
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error fetching summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
