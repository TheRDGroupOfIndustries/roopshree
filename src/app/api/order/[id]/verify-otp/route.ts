import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { deleteExpiredOtps } from "@/lib/otpCleanup";

type Params = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const orderId = params.id;
    const { otp: providedOtp } = await req.json();

    if (!providedOtp)
      return NextResponse.json({ error: "otp is required" }, { status: 400 });

    // ✅ Authenticate delivery boy
    const requestCookies = cookies();
    const token = (await requestCookies).get("token")?.value;
    const payload = token ? await verifyJwt(token) : null;
    if (!payload)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!payload.role?.includes("DELIVERY_BOY"))
      return NextResponse.json(
        { error: "Forbidden: only delivery boys can verify OTP" },
        { status: 403 }
      );

    // ✅ Cleanup expired OTPs
    await deleteExpiredOtps();

    // ✅ Fetch order + OTP
    const [order, orderOtp] = await Promise.all([
      prisma.order.findUnique({ where: { id: orderId } }),
      prisma.orderOtp.findUnique({ where: { orderId } }),
    ]);

    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (!orderOtp)
      return NextResponse.json(
        { error: "No OTP found for this order" },
        { status: 400 }
      );

    // ✅ Ensure assigned delivery boy
    if (order.deliveryBoyId !== payload.userId)
      return NextResponse.json(
        { error: "Forbidden: not assigned to this order" },
        { status: 403 }
      );

    // ✅ Compare OTP
    if (orderOtp.otp !== providedOtp)
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

    // ✅ Mark order DELIVERED & cleanup OTP
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "DELIVERED" },
    });
    await prisma.orderOtp.deleteMany({ where: { orderId } });

    return NextResponse.json(
      { message: "Order marked as DELIVERED", order: updatedOrder },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("verify-otp error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
