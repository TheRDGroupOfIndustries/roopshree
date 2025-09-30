import { NextResponse } from "next/server";
import type { SignupBody } from "../../../../types/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SignupBody;
    const { name, email, password, confirmPassword } = body;

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    // 👉 Forward to your friend’s OTP service here
    return NextResponse.json({ message: "otp_sent" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
