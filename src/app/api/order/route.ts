import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { Order, Status } from "@/generated/prisma/client";

//all order
export async function GET() {
  try {
    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = await verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (payload.role.includes("ADMIN")) {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          product: true,
          user: true,
          address: true,
        },
      });
      return NextResponse.json(orders);
    }

    const userId = payload.userId.toString();
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      orderBy: { createdAt: "desc" },
      include: {
        product: true,
      },
    });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

interface CreateOrder {
  totalAmount: number;
  address: string;
  paymentMode?: string;
  referralCode?: string;
  products: {
    productId: string;
    quantity: number;
    size?: string;
    color?: string;
  }[];
}

export async function POST(req: Request) {
  try {
    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = payload.userId.toString();
    const body = (await req.json()) as CreateOrder;
    const { products, totalAmount, address, paymentMode, referralCode } = body;

    if(!address || !userId || products.length === 0){
      NextResponse.json({error: "Required fields missing"}, {status: 400})
    }


    // validate the address id belongs to the user
    const existAddress = await prisma.address.findUnique({
      where: { id: address },
    });

    if (!existAddress || existAddress.userId !== userId) {
      return NextResponse.json(
        { error: "Address not found or forbidden" },
        { status: 404 }
      );
    }

//  create order for each products
    const orders = await Promise.all(
      products.map(async (product) => {
        const { productId, quantity, size, color } = product;
        const order = await prisma.order.create({
          data: {
            productId,
            addressId: address,
            userId,
            quantity,
            totalAmount,
            paymentMode,
            referralCode,
            size,
            color,
          },
        });

        // Update stock on order  
        await prisma.stock.update({
          where: { productId },
          data: {
            currentStock: { decrement: quantity },
          },
        });

        return order;
      })
    );




    // const order = await prisma.order.create({
    //   data: {
    //     productId: id,
    //     addressId,
    //     userId,
    //     quantity,
    //     totalAmount,
    //     status,
    //     paymentMode,
    //     referralCode,
    //   },
    // });

    // Update stock on order

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
