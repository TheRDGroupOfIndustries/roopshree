import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, context: Params) {
  try {
    const { params } = await context; // ✅ await here
    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyJwt(token);
    if (!payload || !payload.role.includes("ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const offer = await prisma.offer.findUnique({
      where: { id: params.id },
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    return NextResponse.json(offer);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, context: Params) {
  try {
    const { params } = await context; // ✅ await here
    const body = await req.json();
    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyJwt(token);
    if (!payload || !payload.role.includes("ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!body.title || !body.date) {
      return NextResponse.json(
        { error: "Title and Date are required" },
        { status: 400 }
      );
    }

    const updatedOffer = await prisma.offer.update({
      where: { id: params.id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        date: new Date(body.date), // convert string to Date
      },
    });

    return NextResponse.json(updatedOffer);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
