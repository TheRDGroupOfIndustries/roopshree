import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { comparePassword } from "../../../../lib/hash";
import { signJwt } from "../../../../lib/jwt";
import { setTokenCookie } from "../../../../lib/cookies";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const isValid = await comparePassword(password, user.password);
    if (!isValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = signJwt({ userId: user.id, name: user.name, email: user.email });
    const safeUser = { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt.toISOString() };

    const response = NextResponse.json({ user: safeUser });
    response.headers.set("Set-Cookie", setTokenCookie(token));

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "login Internal server error" }, { status: 500 });
  }
}
