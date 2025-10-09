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
