import { authenticate } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { DecodedUser } from "@/types/auth";
import { NextRequest, NextResponse } from "next/server"; // your auth helper

export async function POST(req: NextRequest) {
    try {
        const user: DecodedUser | null = await authenticate(req);
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { productId, quantity } = await req.json();

        // find or create a cart
        let cart = await prisma.cart.findUnique({ where: { userId: user.userId } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId: user.userId } });
        }

        // check if product already in cart
        const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId },
        });

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
            });
        }

        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: { items: { include: { product: true } } },
        });

        return NextResponse.json(updatedCart);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}


export async function GET(req: NextRequest) {
    try {
        const user: DecodedUser | null = await authenticate(req);
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });


        const cart = await prisma.cart.findUnique({
            where: { userId: user?.userId },
            include: { items: { include: { product: true } } },
        });
        if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });


        return NextResponse.json(cart);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });

    }
}