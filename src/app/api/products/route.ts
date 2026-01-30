import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

// GET all products
export async function GET() {
  const products = await prisma.products.findMany({
    include: { 
      reviews: true, 
      stock: true 
    },
  });

  const productsWithStock = products.map(product => ({
    ...product,
    stock: product.stock?.currentStock || 0,
  }));

  return NextResponse.json(productsWithStock);
}

// CREATE product
interface CreateProductBody {
  title: string;
  description: string;
  images: string[];
  video?: string | null;
  details: string;
  insideBox: string[];
  userId: string;
  initialStock: number;
  price: number;
  oldPrice: number;
  exclusive?: number;
  category: string;
  colour?: string[];
  isSpotlight?: boolean;
}

export async function POST(req: Request) {
  try {
    const requestCookies = cookies();
    const body = (await req.json()) as CreateProductBody;
    const token = (await requestCookies).get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!payload.role.includes("ADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized admin" },
        { status: 401 }
      );
    }

    const userId = payload.userId.toString();
    const { 
      title, 
      description, 
      images, 
      video,
      details, 
      insideBox, 
      initialStock, 
      colour,
      isSpotlight
    } = body;
    
    // ✅ FIXED VALIDATION - Allow stock to be 0
    if (
      !title ||
      !description ||
      !images ||
      !details ||
      !insideBox ||
      !body.category ||
      initialStock === undefined ||
      initialStock === null ||
      initialStock < 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields or invalid stock value" },
        { status: 400 }
      );
    }

    // ✅ Only check price for non-spotlight products
    if (!isSpotlight) {
      if (!body.price || !body.oldPrice) {
        return NextResponse.json(
          { error: "Price and old price are required for non-spotlight products" },
          { status: 400 }
        );
      }
    }

    // ✅ CREATE PRODUCT WITH STOCK IN ONE TRANSACTION
    const product = await prisma.products.create({
      data: {
        title,
        description,
        images,
        video: video || null,
        details,
        userId,
        insideBox,
        price: isSpotlight ? 0 : body.price,
        oldPrice: isSpotlight ? 0 : body.oldPrice,
        exclusive: body.exclusive,
        category: body.category,
        colour: colour || [],
        isSpotlight: isSpotlight || false,
        spotlightAt: isSpotlight ? new Date() : null,
        // ✅ CREATE STOCK RELATION HERE
        stock: {
          create: {
            currentStock: initialStock,
            history: {
              create: {
                fromQuantity: 0,
                toQuantity: initialStock,
                updatedBy: userId,
              },
            },
          },
        },
      },
      include: {
        stock: true,
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