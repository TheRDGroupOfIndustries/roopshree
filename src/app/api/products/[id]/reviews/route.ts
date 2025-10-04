import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

type Params = { params: { id: string } };

// GET reviews for a product
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  // Await params before accessing its properties
  const { id } = await params;
  
  const reviews = await prisma.review.findMany({
    where: { productId: id },
    include: { user: true },
  });
  
  return NextResponse.json(reviews);
}

// POST add review

interface CreateReviewBody {
  rating: number;
  comment: string;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params FIRST before accessing its properties
    const { id } = await params;
    
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
    const { rating, comment } = (await req.json()) as CreateReviewBody;

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        productId: id,  // Use the awaited 'id' instead of params.id
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//Delete review
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Get reviewId from query parameter
    const url = new URL(req.url);
    const reviewId = url.searchParams.get("reviewId");
    
    // Check if reviewId is provided
    if (!reviewId) {
      return NextResponse.json({ error: "reviewId is required" }, { status: 400 });
    }
    
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

    // Find the specific review by reviewId
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if user owns this review
    if (userId !== review.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete the review
    await prisma.review.delete({ where: { id: review.id } });
    return NextResponse.json({ message: "review deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}