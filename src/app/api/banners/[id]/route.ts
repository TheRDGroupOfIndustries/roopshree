import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

async function getUserFromRequest(req: NextRequest) {
  const requestCookies = cookies();
  const token = (await requestCookies).get("token")?.value;
  if (!token) return null;
  const payload = await verifyJwt(token);
  return payload;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload || !payload.role.includes("ADMIN"))
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const banner = await prisma.banners.findUnique({
      where: { id: params.id },
    });
    if (!banner)
      return NextResponse.json({ message: "Banner not found" }, { status: 404 });

    await prisma.banners.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Banner deleted" }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const banner = await prisma.banners.findUnique({
      where: { id: params.id },
    });
    return NextResponse.json(banner, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getUserFromRequest(req);
    if (!payload || !payload.role.includes("ADMIN"))
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const banner = await prisma.banners.findUnique({
      where: { id: params.id },
    });
    if (!banner)
      return NextResponse.json({ message: "Banner not found" }, { status: 404 });

    const body = await req.json();
    const updatedBanner = await prisma.banners.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedBanner, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
