import OrderManagement from "@/Components/admin/Orders";
import prisma from "@/lib/prisma";

export default async function Page() {
  const totalOrders = await prisma.order.count();
  console.log("Total Orders: ", totalOrders);
  return (
    <OrderManagement totalOrders={totalOrders} />
  );
};
