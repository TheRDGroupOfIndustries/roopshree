import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

// GET all products
export async function GET() {
  const products = await prisma.products.findMany({
    include: { reviews: true, stock: true},
  });
  return NextResponse.json(products);
}

// CREATE product

interface CreateProductBody {
  title: string;
  description: string;
  images: string[];
  details: string;
  insideBox: string[];
  userId: string;
  initialStock: number;
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
    const { title, description, images, details, insideBox, initialStock } =
      body;
    if (
      !title ||
      !description ||
      !images ||
      !details ||
      !insideBox ||
      !initialStock
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.products.create({
      data: {
        title,
        description,
        images,
        details,
        userId,
        insideBox,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product creation failed" },
        { status: 500 }
      );
    }

    await prisma.stock.create({
      data: {
        productId: product.id,
        currentStock: initialStock,
        history: {
          create: {
            fromQuantity: 0,
            toQuantity: initialStock,
            updatedBy: userId,
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
