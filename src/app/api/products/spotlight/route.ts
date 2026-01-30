import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all spotlight products
export async function GET() {
  try {
    const spotlightProducts = await prisma.products.findMany({
      where: {
        isSpotlight: true,
      },
      include: {
        reviews: true,
        stock: true,
      },
      orderBy: {
        spotlightAt: 'desc', // Newest spotlight products first
      },
    });

    const productsWithStock = spotlightProducts.map(product => ({
      ...product,
      stock: product.stock?.currentStock || 0,
    }));

    return NextResponse.json(productsWithStock);
  } catch (error: any) {
    console.error("Error fetching spotlight products:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}