import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { comparePassword } from "../../../../lib/hash";
import { signJwt } from "../../../../lib/jwt";
import type { LoginBody, SafeUser } from "../../../../types/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginBody;
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "email and password required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = signJwt({ userId: user.id, email: user.email });

    const safeUser: SafeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };

    return NextResponse.json({ token, user: safeUser }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
