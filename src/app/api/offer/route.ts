import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

export async function GET() {
    try {
        const requestCookies = cookies();
        const token = (await requestCookies).get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const payload = verifyJwt(token);
        if (!payload || !payload.role.includes("ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const offers = await prisma.offer.findMany();
        return NextResponse.json(offers);

    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

interface offer {
  title: string;
  subtitle?: string;
  date: Date;
}

export async function POST(req: Request) {
  try {
    const requestCookies = cookies();
    const body = (await req.json()) as offer;
    const token = (await requestCookies).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = await verifyJwt(token);
    if (!payload || !payload.role.includes("ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const offer = await prisma.offer.create({
  data: {
    title: body.title,
    subtitle: body.subtitle,
    date: new Date(body.date), // ✅ convert to Date
  },
});
    return NextResponse.json(offer);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

