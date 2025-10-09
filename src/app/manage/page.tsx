import Dashboard from "@/Components/admin/Dashboard";
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

  return <Dashboard recentOrders={recentOrders} />;
}
