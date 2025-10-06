import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { hashPassword } from "../../../../lib/hash";
import { signJwt } from "../../../../lib/jwt";
import { setTokenCookie } from "../../../../lib/cookies";
import { signupSchema } from "../../../../lib/validations/Signup";
import { Role } from "../../../../generated/prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.role) {
      body.role = Role[body.role.toUpperCase() as keyof typeof Role];
    }

    // ✅ validate using Zod
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    const token = signJwt({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };

    const response = NextResponse.json({ user: safeUser });
    response.headers.set("Set-Cookie", setTokenCookie(token));
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Signup Internal server error" },
      { status: 500 }
    );
  }
}
