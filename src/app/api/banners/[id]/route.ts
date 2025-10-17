import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

// Helper to get user from request
async function getUserFromRequest(req: NextRequest) {
  const requestCookies = cookies();
  const token = (await requestCookies).get("token")?.value;
  if (!token) return null;
  const payload = await verifyJwt(token);
  return payload;
}

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
