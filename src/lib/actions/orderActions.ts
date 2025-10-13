"use server";

import { Status } from "@/generated/prisma";
import { authenticateAdmin } from "../auth";
import prisma from "../prisma";

export async function getOrders({
  page = 1,
  limit = 10,
  status,
}: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  await authenticateAdmin();

  const skip = (page - 1) * limit;
  const take = limit;
  const where = status ? { status: status as any } : {};
  const orders = await prisma.order.findMany({
    where,
    skip,
    take,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      user: {
        select: {
          name: true,
        },
      },
      createdAt: true,
      status: true,
      totalAmount: true,
    },
  });

  return orders;
}

export async function getOrder(id: string) {
  await authenticateAdmin();

  const order = await prisma.order.findMany({
    where: { id },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
      deliveryBoy: {
        omit: {
          password: true,
        },
      },
      address: true,
      product: true,
    },
  });

  return order;
}

export async function getDeliveryBoys() {
  await authenticateAdmin();

  const deliveryBoys = await prisma.user.findMany({
    where: { role: "DELIVERY_BOY" },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return deliveryBoys;
}

export async function updateOrderStatus(
  id: string,
  status: Status,
  deliveryBoyId?: string
) {
  await authenticateAdmin();
  if (status === "OUTOFDELIVERY" && !deliveryBoyId) {
    throw new Error("Delivery boy is required for this status");
  }

  let order;
  if (status === "OUTOFDELIVERY") {
    order = await prisma.order.update({
      where: { id },
      data: {
        status,
        deliveryBoyId,
      },
    });
  } else {
    order = await prisma.order.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  return order;
}

export async function getOrderAnalytics() {
  try {
    await authenticateAdmin();

    // Fetch all delivered orders
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const orders = await prisma.order.findMany({
      where: {
        status: "DELIVERED",
        createdAt: { gte: oneYearAgo },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
    });

    // Aggregate analytics per month
    const analytics: Record<
      string,
      { totalOrders: number; totalRevenue: number }
    > = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`; // e.g., "2025-10"

      if (!analytics[monthKey]) {
        analytics[monthKey] = { totalOrders: 0, totalRevenue: 0 };
      }

      analytics[monthKey].totalOrders += 1;
      analytics[monthKey].totalRevenue += order.totalAmount;
    });

    // Convert analytics object to array if needed
    const result = Object.entries(analytics).map(([month, data]) => ({
      month,
      ...data,
    }));

    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getTodaysSale() {
  await authenticateAdmin();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the beginning of today

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // Set to the beginning of tomorrow

  const sales = await prisma.order.aggregate({
    where: {
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
      // status: "DELIVERED",
    },
    _sum: {
      totalAmount: true,
    },
    _count: {
      id: true,
    },
  });

  return {
    totalRevenue: sales._sum.totalAmount || 0,
    totalOrders: sales._count.id || 0,
  };
}
