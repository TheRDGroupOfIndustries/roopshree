import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // get user id from route
    const body = await req.json();

    // Only allow certain fields to be updated
    const allowedFields = ["name", "role", "profileImage", "email", ""];
    const dataToUpdate: Record<string, any> = {};

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        dataToUpdate[key] = body[key];
      }
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided to update" },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    // Don't send password back
    const { password, ...safeUser } = updatedUser;

    return NextResponse.json({ user: safeUser });
  } catch (error: any) {
    console.error("Failed to update user:", error);

    if (error.code === "P2025") {
      // User not found
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function POST(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extract the id string from the params object
    const { id } = await params;
    
    const users = await prisma.user.findFirst({
      where: { id: id }, // or just { id } in shorthand
    });
    
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}