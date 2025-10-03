import { authenticate } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const user = await authenticate(req);
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const cart = await prisma.cart.findUnique({ where: { userId: user.userId } });
        if (!cart) return NextResponse.json({ message: "Cart already empty" });

        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

        return NextResponse.json({ message: "Cart cleared" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
