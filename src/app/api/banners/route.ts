import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

export async function GET() {
  const products = await prisma.banners.findMany({});
  return NextResponse.json(products);
}

interface CreateProductBody {
  title: string;
  subtitle?: string;
  image: string;
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

    // const userId = payload.userId.toString();
    const { title, subtitle, image } = body;
    if (!title || !subtitle || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const banner = await prisma.banners.create({
      data: {
        title,
        subtitle,
        image,
      },
    });

    return NextResponse.json(banner);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
