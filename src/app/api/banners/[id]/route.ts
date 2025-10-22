import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { v2 as cloudinary } from "cloudinary";

// Helper to get user from request
async function getUserFromRequest(req: NextRequest) {
  const requestCookies = cookies();
  const token = (await requestCookies).get("token")?.value;
  if (!token) return null;
  const payload = await verifyJwt(token);
  return payload;
}

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


// DELETE Banner
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // <--- must match Next.js expected type
) {
  try {
    const { id } = await context.params;

    const payload = await getUserFromRequest(req);
    if (!payload || !payload.role.includes("ADMIN"))
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const banner = await prisma.banners.findUnique({ where: { id } });
    if (!banner)
      return NextResponse.json({ message: "Banner not found" }, { status: 404 });

    // 🔥 Delete image from Cloudinary if exists
    if (banner.image) {
      const publicId = extractPublicId(banner.image);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, { invalidate: true });
          console.log("🧩 Banner image deleted:", publicId);
        } catch (cloudErr) {
          console.error("Cloudinary delete error:", cloudErr);
        }
      }
    }

    await prisma.banners.delete({ where: { id } });
    return NextResponse.json({ message: "Banner deleted" }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

function extractPublicId(url: string): string {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return "";
    const publicPath = parts.slice(uploadIndex + 2).join("/"); // skip version
    return publicPath.replace(/\.[^/.]+$/, ""); // remove extension
  } catch {
    return "";
  }
}

// GET stock by productId
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const stock = await prisma.stock.findUnique({
    where: { productId: id },
    include: { history: true },
  });

  return NextResponse.json(stock);
}

// PATCH Banner
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const payload = await getUserFromRequest(req);
    if (!payload || !payload.role.includes("ADMIN"))
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const banner = await prisma.banners.findUnique({ where: { id } });
    if (!banner)
      return NextResponse.json({ message: "Banner not found" }, { status: 404 });

    const body = await req.json();
    const updatedBanner = await prisma.banners.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedBanner, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}