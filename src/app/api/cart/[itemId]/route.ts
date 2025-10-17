import { authenticate } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, context: { params: Promise<{ itemId: string }> }) {
    try {
        const user = await authenticate(req);
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { quantity } = await req.json();
        const { itemId} = await context.params;

        const item = await prisma.cartItem.findUnique({
            where: { id:itemId },
            include: { cart: true },
        });

        if (!item || item.cart.userId !== user.userId) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const updatedItem = await prisma.cartItem.update({
            where: {id: itemId},
            // data: { quantity: item.quantity + quantity }
            data: { quantity: quantity }
        });

        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest, context: { params: Promise<{ itemId: string }> }) {
    try {
        const user = await authenticate(req);
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { itemId } = await context.params;

        const item = await prisma.cartItem.findUnique({
            where: {id: itemId },
            include: { cart: true },
        });

        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        if (!item.cart || item.cart.userId !== user.userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.cartItem.delete({ where: { id:itemId} });
        return NextResponse.json({ message: "Item removed from cart", itemId});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}