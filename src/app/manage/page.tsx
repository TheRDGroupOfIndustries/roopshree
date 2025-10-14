import Dashboard from "@/Components/admin/Dashboard";
import { getOrderAnalytics } from "@/lib/actions/orderActions";
import prisma from "@/lib/prisma";

export interface RecentOrders {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  user: {
    name: string;
  };
}

export interface OrderAnalytics {
  month: string;
  totalOrders: number;
  totalRevenue: number;
}

export default async function Page() {
  const recentOrders: RecentOrders[] = await prisma.order.findMany({
    select: {
      id: true,
      totalAmount: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const orderAnalytics = await getOrderAnalytics()

  return <Dashboard recentOrders={recentOrders} orderAnalytics={orderAnalytics} />;
}
