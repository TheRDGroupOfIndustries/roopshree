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
  const { id } = await params;

  const product = await prisma.products.findUnique({
    where: { id },
    include: { 
      reviews: true,
      stock: true // ✅ Stock include kiya
    },
  });

  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  // ✅ Stock value ko product object mein add karo
  const productWithStock = {
    ...product,
    stock: product.stock?.currentStock || 0, // Default 0 if no stock record
  };

  return NextResponse.json(productWithStock);
}

// UPDATE product
interface updateProductBody {
  title: string;
  description: string;
  images: string[];
  video?: string; 
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

    // ✅ Update product details
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

    // ✅ Update stock if provided
    if (stock !== undefined) {
      const curStock = await prisma.stock.findUnique({
        where: { productId: id },
      });

      if (curStock) {
        // Update existing stock
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
      } else {
        // Create new stock record if doesn't exist
        await prisma.stock.create({
          data: {
            productId: id,
            currentStock: stock,
            history: {
              create: {
                fromQuantity: 0,
                toQuantity: stock,
                updatedBy: userId,
              },
            },
          },
        });
      }
    }

    // ✅ Fetch updated product with stock
    const finalProduct = await prisma.products.findUnique({
      where: { id },
      include: {
        reviews: true,
        stock: true,
      },
    });

    const productWithStock = {
      ...finalProduct,
      stock: finalProduct?.stock?.currentStock || 0,
    };

    revalidatePath(req.url);
    return NextResponse.json(productWithStock);
  } catch (error: any) {
    console.error("Update error:", error);
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

    // ✅ Delete stock first (foreign key constraint)
    await prisma.stock.deleteMany({ where: { productId: id } });

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
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return "";
    const publicPath = parts.slice(uploadIndex + 2).join("/");
    return publicPath.replace(/\.[^/.]+$/, "");
  } catch {
    return "";
  }
}