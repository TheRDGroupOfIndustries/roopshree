import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";

export async function PUT(req: Request) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and new password are required." },
        { status: 400 }
      );
    }

    // ✅ Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // ✅ Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // ✅ Update user's password
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // 🧹 Don’t send password back
    const { password, ...safeUser } = updatedUser;

    return NextResponse.json({
      success: true,
      message: "Password updated successfully!",
      user: safeUser,
    });
  } catch (error: any) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}
