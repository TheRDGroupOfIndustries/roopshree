import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/lib/jwt";

// GET all stocks
export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user || user.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const stocks = await prisma.stock.findMany({
      include: {
        product: true,
        history: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return NextResponse.json(stocks);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// CREATE stock entry for a product
export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      description,
      images,
      details,
      insideBox,
      initialStock, // ✅ Can be 0
      price,
      oldPrice,
      exclusive,
      category,
      colour,
      video,
      isSpotlight,
    } = await req.json();

    // ✅ FIXED VALIDATION - Allow stock to be 0
    if (
      !title ||
      !description ||
      !category ||
      initialStock === undefined || // ✅ This allows 0
      initialStock === null ||
      initialStock < 0 // ✅ But reject negative
    ) {
      return NextResponse.json(
        { error: "Missing required fields or invalid stock value" },
        { status: 400 }
      );
    }

    // Only check price for non-spotlight products
    if (!isSpotlight) {
      if (!price || !oldPrice) {
        return NextResponse.json(
          { error: "Price and old price are required for non-spotlight products" },
          { status: 400 }
        );
      }
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        title,
        description,
        images: images || [],
        details,
        insideBox: insideBox || [],
        price: isSpotlight ? 0 : price,
        oldPrice: isSpotlight ? 0 : oldPrice,
        exclusive,
        category,
        colour: colour || [],
        video,
        isSpotlight: isSpotlight || false,
        stock: initialStock, // ✅ This can be 0 now
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("❌ Product creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
