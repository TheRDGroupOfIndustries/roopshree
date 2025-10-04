import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { emailSchema } from "../../../../lib/validations/Signup"; // path as per your project

function generateOTP(limit: number) {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < limit; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ✅ Validate email with Zod
    const parsed = emailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const otp = generateOTP(6);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "RoopShree - OTP Verification",
      html: `<div style="font-family: Arial; text-align:center; padding:20px;">
        <h2>Secure OTP Verification</h2>
        <p>Your OTP is:</p>
        <div style="font-size:24px; font-weight:bold; color:blue;">${otp}</div>
      </div>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: "OTP sent successfully!", otp }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
