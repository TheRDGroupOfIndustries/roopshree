import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import nodemailer from "nodemailer";
import { generateOTP } from "@/lib/otp";
import { deleteExpiredOtps } from "@/lib/otpCleanup";

type Params = { params: { id: string } };

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export async function POST(_: NextRequest, { params }: Params) {
  try {
    const orderId = params.id;

    // ✅ Authenticate delivery boy
    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;
    const payload = token ? await verifyJwt(token) : null;
    if (!payload)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!payload.role?.includes("DELIVERY_BOY"))
      return NextResponse.json(
        { error: "Forbidden: only delivery boys can send OTP" },
        { status: 403 }
      );

    // ✅ Fetch order + customer
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });
    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // ✅ Ensure assigned delivery boy
    if (order.deliveryBoyId !== payload.userId)
      return NextResponse.json(
        { error: "Forbidden: not assigned to this order" },
        { status: 403 }
      );

    // ✅ Status check
    if (order.status !== "OUTOFDELIVERY")
      return NextResponse.json(
        {
          error: `Order status must be OUTOFDELIVERY. Current: ${order.status}`,
        },
        { status: 400 }
      );

    // ✅ Cleanup expired OTPs
    await deleteExpiredOtps();

    // ✅ Generate OTP & expiry
    const otp = generateOTP(4);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // ✅ Remove old OTP & save new
    await prisma.orderOtp.deleteMany({ where: { orderId } });
    await prisma.orderOtp.create({
      data: { orderId, otp, expiresAt, createdBy: payload.userId },
    });

    // ✅ Send email
    if (!order.user?.email)
      return NextResponse.json(
        { error: "Customer email not found" },
        { status: 500 }
      );
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.user.email,
      subject: `OTP for Order ${orderId}`,
      html: `<div style="font-family: Arial; text-align:center; padding:20px;">
        <h2>Delivery Confirmation OTP</h2>
        <div style="font-size:24px; font-weight:bold; color:blue;">${otp}</div>
        <p>Valid for 5 minutes.</p>
      </div>`,
    });

    return NextResponse.json(
      { message: "OTP sent to customer email" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("send-otp error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
