import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import nodemailer from "nodemailer";
import { generateOTP } from "@/lib/otp";
import { deleteExpiredOtps } from "@/lib/otpHelpers"; // ✅ helper that deletes expired OTPs

type Params = { params: Promise<{ id: string }> };

// ✅ Configure your email transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export async function POST(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await context.params;

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

    // ✅ Fetch order + user (customer)
    const order = await prisma.order.findUnique({
      where: { id},
      include: { user: true },
    });

    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // ✅ Ensure this delivery boy is assigned to the order
    if (order.deliveryBoyId !== payload.userId)
      return NextResponse.json(
        { error: "Forbidden: not assigned to this order" },
        { status: 403 }
      );

    // ✅ Ensure order is in correct state
    if (order.status !== "OUTOFDELIVERY")
      return NextResponse.json(
        {
          error: `Order status must be OUTOFDELIVERY. Current: ${order.status}`,
        },
        { status: 400 }
      );

    // 🧹 Cleanup expired OTPs before creating new
    await deleteExpiredOtps();

    // ✅ Generate new OTP (4 digits) & expiry (5 min)
    const otp = generateOTP(4);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // ✅ Remove any existing OTP for this order
    await prisma.orderOtp.deleteMany({ where: { id } });

    // ✅ Save new OTP in DB
    await prisma.orderOtp.create({
      data: {
        orderId: id,
        otp,
        expiresAt,
        createdBy: payload.userId,
      },
    });

    // ✅ Send email to customer
    if (!order.user?.email)
      return NextResponse.json(
        { error: "Customer email not found" },
        { status: 500 }
      );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.user.email,
      subject: `OTP for Order ${id}`,
      html: `
        <div style="font-family: Arial; text-align:center; padding:20px;">
          <h2>Delivery Confirmation OTP</h2>
          <div style="font-size:24px; font-weight:bold; color:blue;">${otp}</div>
          <p>Valid for 5 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "OTP sent successfully to customer email" },
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
