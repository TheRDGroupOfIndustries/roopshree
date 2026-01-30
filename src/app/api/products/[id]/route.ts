import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

type Params = { params: { id: string } };

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
      stock: true
    },
  });

  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const productWithStock = {
    ...product,
    stock: product.stock?.currentStock || 0,
  };

  return NextResponse.json(productWithStock);
}

// UPDATE product
interface updateProductBody {
  title: string;
  description: string;
  images: string[];
  video?: string | null; // ✅ YEH ADD HUA
  details: string;
  insideBox: string[];
  userId?: string;
  stock?: number;
  price: number;
  oldPrice: number;
  exclusive?: number;
  category: string;
  colour?: string[];
  isSpotlight?: boolean;
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
      video,
      details,
      insideBox,
      stock,
      price,
      oldPrice,
      exclusive,
      colour,
      isSpotlight,
    } = body;

    // ✅ FIX: Add isSpotlight to update query
    const updated = await prisma.products.update({
      where: { id },
      data: {
        title,
        description,
        images,
        video: video || null,
        details,
        insideBox,
        price,
        oldPrice,
        exclusive,
        category: body.category,
        colour,
        isSpotlight: isSpotlight !== undefined ? isSpotlight : product.isSpotlight,  // ✅ NEW
        spotlightAt: isSpotlight && !product.isSpotlight ? new Date() : product.spotlightAt,  // ✅ NEW
      },
    });

    if (stock !== undefined) {
      const curStock = await prisma.stock.findUnique({
        where: { productId: id },
      });

      if (curStock) {
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

      // ✅ YEH ADD HUA - Video delete
      if (product.video) {
        const videoPublicId = extractPublicId(product.video);
        if (videoPublicId) {
          console.log("🎥 Deleting video:", videoPublicId);
          await cloudinary.uploader.destroy(videoPublicId, {
            invalidate: true,
            resource_type: "video",
          });
        }
      }
    } catch (cloudErr: any) {
      console.error("Cloudinary delete error:", cloudErr);
    }

    await prisma.stock.deleteMany({ where: { productId: id } });
    await prisma.products.delete({ where: { id } });

    return NextResponse.json({ message: "Product, images & video deleted" });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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