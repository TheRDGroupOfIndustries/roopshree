import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

type Params = { params: { id: string } };

// GET reviews for a product
export async function GET(_: Request, { params }: Params) {
  const reviews = await prisma.review.findMany({
    where: { productId: params.id },
    include: { user: true },
  });
  return NextResponse.json(reviews);
}

// POST add review

interface CreateReviewBody {
  rating: number;
  comment: string;
}

export async function POST(req: Request, { params }: Params) {
  try {
    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = payload.userId.toString();
    const { rating, comment } = await req.json() as CreateReviewBody;

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        productId: params.id,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    
    await prisma.review.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "review deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
