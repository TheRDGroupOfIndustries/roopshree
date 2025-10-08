import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { revalidatePath } from "next/cache";

type Params = { params: { id: string } };

// GET product by ID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params before accessing its properties
  const { id } = await params;

  const product = await prisma.products.findUnique({
    where: { id },
    include: { reviews: true },
  });

  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(product);
}

// UPDATE product

interface updateProductBody {
  title: string;
  description: string;
  images: string[];
  details: string;
  insideBox: string[];
  userId?: string;
  stock?: number;
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const product = await prisma.products.findUnique({
      where: { id: params.id },
    });

    if (!product)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const requestCookies = cookies();
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
    if (product.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = (await req.json()) as updateProductBody;

    // Destructure only allowed fields from body
    const { title, description, images, details, insideBox, stock } = body;

    const updated = await prisma.products.update({
      where: { id: params.id },
      data: {
        title,
        description,
        images,
        details,
        insideBox,
      },
    });

    const curStock = await prisma.stock.findUnique({
      where: { productId: params.id },
    });

    if (curStock && stock) {
      await prisma.stock.update({
        where: { productId: params.id },
        data: {
          currentStock: stock,
          history: {
            create: {
              fromQuantity: curStock.currentStock,
              toQuantity: stock,
              updatedBy: userId,
            },
          },
        },
      });
    }

    revalidatePath(req.url);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(_: Request, { params }: Params) {
  try {
    const product = await prisma.products.findUnique({
      where: { id: params.id },
    });

    if (!product)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const requestCookies = cookies();
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
    if (product.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.products.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Product deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
