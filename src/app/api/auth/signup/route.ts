import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { hashPassword } from "../../../../lib/hash";
import { signJwt } from "../../../../lib/jwt";
import { setTokenCookie } from "../../../../lib/cookies";

export async function POST(req: Request) {
  try {
    const { name, email, password, confirmPassword } = await req.json();

    if (!name || !email || !password || !confirmPassword)
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });

    if (password !== confirmPassword)
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "User already exists" }, { status: 400 });

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user only AFTER OTP verification in your frontend
    const user = await prisma.user.create({ data: { name, email, password: hashedPassword } });

    const token = signJwt({ userId: user.id, name: user.name, email: user.email, role: user.role });
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role ,createdAt: user.createdAt.toISOString() };

    const response = NextResponse.json({ user: safeUser });
    response.headers.set("Set-Cookie", setTokenCookie(token));

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Signup Internal server error" }, { status: 500 });
  }
}
