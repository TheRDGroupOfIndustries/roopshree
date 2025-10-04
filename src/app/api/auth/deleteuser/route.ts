import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { email } = await req.json();

    // Find the user first
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Now delete the user
    await prisma.user.delete({ where: { email } });

    return NextResponse.json({ message: "User deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// identify the total user just a checker
export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
