import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

type Params = { params: { id: string } };
// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
  price: number;
  oldPrice: number;
  exclusive?: number;
  category: string;
  colour?: string[];
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.products.findUnique({ where: { id } });
    if (!product)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!payload.role.includes("ADMIN"))
      return NextResponse.json(
        { error: "Unauthorized admin" },
        { status: 401 }
      );

    const userId = payload.userId.toString();
    // if (product.userId !== userId)
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as updateProductBody;
    const {
      title,
      description,
      images,
      details,
      insideBox,
      stock,
      price,
      oldPrice,
      exclusive,
      colour,
    } = body;

    const updated = await prisma.products.update({
      where: { id },
      data: {
        title,
        description,
        images,
        details,
        insideBox,
        price,
        oldPrice,
        exclusive,
        category: body.category,
        colour,
      },
    });

    const curStock = await prisma.stock.findUnique({
      where: { productId: id },
    });
    if (curStock && stock) {
      await prisma.stock.update({
        where: { productId: id },
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

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const product = await prisma.products.findUnique({
      where: { id },
    });

    if (!product)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload || !payload.role.includes("ADMIN"))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ✅ Delete image from Cloudinary
    try {
      // Handle both single and multiple image URLs
      const images = Array.isArray(product.images)
        ? product.images
        : product.images
        ? [product.images]
        : [];

      for (const imgUrl of images) {
        if (!imgUrl) continue;
        const publicId = extractPublicId(imgUrl);
        if (publicId) {
          console.log("🧩 Deleting image:", publicId);
          await cloudinary.uploader.destroy(publicId, {
            invalidate: true,
          });
        }
      }
    } catch (cloudErr: any) {
      console.error("Cloudinary delete error:", cloudErr);
    }

    // ✅ Delete product from DB
    await prisma.products.delete({ where: { id } });

    return NextResponse.json({ message: "Product & image deleted" });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔹 Improved extractor (handles any folder depth correctly)
function extractPublicId(url: string): string {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split("/");
    // Find "upload" index in path
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return "";
    const publicPath = parts.slice(uploadIndex + 2).join("/"); // skip 'v1234'
    return publicPath.replace(/\.[^/.]+$/, ""); // remove extension
  } catch {
    return "";
  }
}


